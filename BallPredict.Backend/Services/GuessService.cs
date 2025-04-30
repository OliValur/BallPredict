using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

//using Postgrest.Constants;
using Supabase;
using static Supabase.Postgrest.Constants;

namespace BallPredict.Backend.Services
{
    public class GuessService
    {
        private readonly Client _supabaseClient;

        public GuessService(ISupabaseClientFactory supabaseFactory)
        {
            _supabaseClient = supabaseFactory.CreateAsync().GetAwaiter().GetResult();
        }
        public async Task<List<Games>> GetUserGuessesAsync(string userId, int week)
        {
            var games = await _supabaseClient
                .From<Games>()
                .Select("*")
                .Where(x => x.Week == week)
                .Get();
            var gamesList = games.Models.ToList();
            var guesses = await _supabaseClient
                .From<Guess>()
                .Select("*")
                .Where(x => x.userId == userId)
                .Get();
            var guessesList = guesses.Models.ToList();
            foreach (var game in gamesList)
            {
                game.Guesses = guessesList 
                    .Where(g => g.gameId == game.Id)
                    .ToList();
            }
            return gamesList;
        }

        public async Task<Boolean> AddGuessAsync(Guess guess)
        {
            var result = await _supabaseClient.From<Guess>().Insert(guess);
            //Console.WriteLine(result);
            return true;
        }
    }
}
