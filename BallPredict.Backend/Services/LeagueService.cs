
using BallPredict.Backend.Models;
using Microsoft.Extensions.Caching.Memory;

//using Postgrest.Constants;
using Supabase;

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

    }
} 