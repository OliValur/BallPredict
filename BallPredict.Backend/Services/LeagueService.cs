using BallPredict.Backend.DTOs;
using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
//using Postgrest.Constants;
using Supabase;

namespace BallPredict.Backend.Services
{

    public class LeagueService
    {
        private readonly ISupabaseClientFactory _supabaseFactory;


        public LeagueService(ISupabaseClientFactory supabaseFactory)
            => _supabaseFactory = supabaseFactory;


        public async Task<Leagues> CreateLeague(Leagues league)
        {
            var client = await _supabaseFactory.CreateAsync();
            try
            {
                var result = await client.From<Leagues>()
                    .Insert(league);
                var createdLeague = result.Models.FirstOrDefault();
                return createdLeague;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error creating league: " + ex.Message);
                return null;
            }
        }

        public async Task<Boolean> AddGuessAsync(Guess guess)
        {
            var client = await _supabaseFactory.CreateAsync();
            var result = await client.From<Guess>().Insert(guess);
            return true;
        }

        public async Task<Boolean> JoinLeague(LeagueMembers leagueMemebers)
        {
            var client = await _supabaseFactory.CreateAsync();
            var result = await client.From<LeagueMembers>().Insert(leagueMemebers);
            return true;
        }

    }
} 