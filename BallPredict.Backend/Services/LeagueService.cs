
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


        public LeagueService(ISupabaseClientFactory supabaseFactory, IMemoryCache memoryCache)
        {
            _supabaseClient = supabaseFactory.CreateAsync().GetAwaiter().GetResult();
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
        public async Task<Boolean> JoinLeague(LeagueMembers leagueMemebers)
        {
            var result = await _supabaseClient.From<LeagueMembers>().Insert(leagueMemebers);
            return true;
        }

        public async Task<List<Leagues>> GetLeaguesByUserId(string userId)
        {
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
            return leaguesResponse.Models.ToList();
        }

        public async Task<List<Teams>> GetLeagueById(Guid leagueId)
        {
            Console.WriteLine($"League Id: {leagueId}");
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
            Console.WriteLine(leagueResponse);
            return leagueResponse.Models.ToList();


        }

    }
} 