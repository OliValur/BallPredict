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
            Console.WriteLine("Halló! " + league);
            var client = await _supabaseFactory.CreateAsync();

            var result = await client.From<Leagues>()
                .Insert(league);
            var createdLeague = result.Models.FirstOrDefault();
            Console.WriteLine("Hér: " + result);
            return createdLeague;
        }

        public async Task<Boolean> AddGuessAsync(Guess guess)
        {
            var client = await _supabaseFactory.CreateAsync();
            var result = await client.From<Guess>().Insert(guess);
            //Console.WriteLine(result);
            return true;
        }

        public async Task<Boolean> JoinLeague(LeagueMembers leagueMemebers)
        {
            Console.WriteLine("Halló! " + leagueMemebers.PlayerId + "             " + leagueMemebers.LeagueId);
            var client = await _supabaseFactory.CreateAsync();

            var result = await client.From<LeagueMembers>().Insert(leagueMemebers);
            //Console.WriteLine(result);
            return true;
        }

    }
}