
using BallPredict.Backend.Models;
using Microsoft.Extensions.Caching.Memory;
using BallPredict.Backend.DTOs;

//using Postgrest.Constants;
using Supabase;
using static Supabase.Postgrest.Constants;

namespace BallPredict.Backend.Services
{

    public class LeagueService
    {
        private readonly Client _supabaseClient;
        private readonly IMemoryCache _memoryCache;
        private readonly GuessService _guessService;


        public LeagueService(ISupabaseClientFactory supabaseFactory, IMemoryCache memoryCache)
        {
            _supabaseClient = supabaseFactory.CreateAsync().GetAwaiter().GetResult();
            _memoryCache = memoryCache;
            _guessService = new GuessService(supabaseFactory, memoryCache);
        }
        public async Task<Leagues> CreateLeague(Leagues league)
        {
            try
            {
                var result = await _supabaseClient.From<Leagues>()
                    .Insert(league);
                var createdLeague = result.Models.FirstOrDefault();
                var leagueMembers = new LeagueMembers
                {
                    LeagueId = createdLeague.Id,
                    PlayerId = league.OwnerId
                };
                await JoinLeague(leagueMembers);
                return createdLeague;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error creating league: " + ex.Message);
                return null;
            }
        }

        public async Task<LeagueInfo> GetLeagueByInviteCode(string inviteCode)
        {
            var response = await _supabaseClient
                .From<LeagueInfo>()
                .Where(l => l.InviteCode == inviteCode)
                .Get();

            return response.Models.FirstOrDefault();
        }
        public async Task<Boolean> JoinLeague(LeagueMembers leagueMembers)
        {
            var result = await _supabaseClient.From<LeagueMembers>().Insert(leagueMembers);
            //invalidate the cache for the user leagues
            _memoryCache.Remove($"user_leagues_{leagueMembers.PlayerId}");
            //invalidate the cache for the league teams
            _memoryCache.Remove($"leagueTeams_{leagueMembers.LeagueId}");
            return true;
        }

        public async Task<List<Leagues>> GetLeaguesByUserId(string userId)
        {
            // Check if the leagues are in the cache
            if (_memoryCache.TryGetValue($"user_leagues_{userId}", out List<Leagues> cachedLeagues))
            {
                return cachedLeagues;
            }
            //fetch all league id's associated with the user and then fetch the league info and return the list of leagues
            var response = await _supabaseClient
                .From<LeagueMembers>()
                .Where(l => l.PlayerId == userId)
                .Get();
            var leagueIds = response.Models.Select(l => l.LeagueId).ToList();
            if (leagueIds.Count == 0)
            {
                return new List<Leagues>();
            }
            var leaguesResponse = await _supabaseClient
                .From<Leagues>()
                 .Filter(x => x.Id, Operator.In, leagueIds)
                .Get();
            // Cache the leagues for 60 minutes
            _memoryCache.Set($"user_leagues_{userId}", leaguesResponse.Models.ToList(), new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(5)
            });
            return leaguesResponse.Models.ToList();
        }

        public async Task<List<TeamsDto>> GetLeagueById(Guid leagueId)
        {
            if (_memoryCache.TryGetValue($"leagueTeams_{leagueId}", out List<TeamsDto> cachedTeams))
            {
                return cachedTeams;
            }

            // Step 1: Get player IDs from LeagueMembers
            var leagueMembers = await _supabaseClient
                .From<LeagueMembers>()
                .Where(l => l.LeagueId == leagueId)
                .Get();

            if (leagueMembers.Models.Count == 0)
            {
                return null;
            }

            var playerIds = leagueMembers.Models.Select(m => m.PlayerId).ToList();

            // Step 2: Get teams by player IDs
            var teamResponse = await _supabaseClient
                .From<Teams>()
                .Filter(t => t.Id, Operator.In, playerIds)
                .Get();

            var teams = teamResponse.Models;

            // Step 3: Get guesses by those users
            var guesses = await _guessService.GetGuessesByUserIds(playerIds, leagueId);

            // Step 4: Group guesses by userId
            var guessesByUserId = guesses
                .GroupBy(g => g.userId)
                .ToDictionary(g => g.Key, g => g.ToList());

            // Step 5: Build TeamsDto list
            var teamsWithGuesses = teams.Select(team => new TeamsDto
            {
                Team = team,
                Guesses = guessesByUserId.TryGetValue(team.Id, out var userGuesses)
                    ? userGuesses.Select(g => new GuessDto
                    {
                        UserId = g.userId,
                        GameId = g.gameId,
                        Prediction = g.guess,
                        // Add any other fields if needed
                    }).ToList()
                    : new List<GuessDto>()
            }).ToList();

            // Step 6: Cache and return
            _memoryCache.Set($"leagueTeams_{leagueId}", teamsWithGuesses, new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(5)
            });

            return teamsWithGuesses;
        }

    }
} 