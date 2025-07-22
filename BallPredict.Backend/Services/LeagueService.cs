
using BallPredict.Backend.Models;
using Microsoft.Extensions.Caching.Memory;

//using Postgrest.Constants;
using Supabase;
using static Supabase.Postgrest.Constants;

namespace BallPredict.Backend.Services
{

    public class LeagueService
    {
        private readonly Client _supabaseClient;
        private readonly IMemoryCache _memoryCache;


        public LeagueService(ISupabaseClientFactory supabaseFactory, IMemoryCache memoryCache)
        {
            _supabaseClient = supabaseFactory.CreateAsync().GetAwaiter().GetResult();
            _memoryCache = memoryCache;
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
        /*
        public async Task<Boolean> AddGuessAsync(Guess guess)
        {
            var client = await _supabaseFactory.CreateAsync();
            var result = await client.From<Guess>().Insert(guess);
            return true;
        }
        */
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

        public async Task<List<Teams>> GetLeagueById(Guid leagueId)
        {

            if (_memoryCache.TryGetValue($"leagueTeams_{leagueId}", out List<Teams> cachedTeams))
               { return cachedTeams; }

                var response = await _supabaseClient
                    .From<LeagueMembers>()
                    .Where(l => l.LeagueId == leagueId)
                    .Get();
                if (response.Models.Count == 0)
                {
                    return null;
                }
                var playerIds = response.Models.Select(m => m.PlayerId).ToList();
                var leagueResponse = await _supabaseClient
                    .From<Teams>()
                    .Filter(t => t.Id, Operator.In, playerIds)
                    .Get();
            _memoryCache.Set($"leagueTeams_{leagueId}", leagueResponse.Models.ToList(), new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(5)
            });
            return leagueResponse.Models.ToList();

        }
    }
} 