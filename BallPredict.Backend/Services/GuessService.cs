using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
//using Postgrest.Constants;
using Supabase;
using static Supabase.Postgrest.Constants;

namespace BallPredict.Backend.Services
{
    public class GuessService
    {
        private readonly ISupabaseClientFactory _supabaseFactory;


        public GuessService(ISupabaseClientFactory supabaseFactory)
        => _supabaseFactory = supabaseFactory;


        public async Task<List<Games>> GetUserGuessesAsync(string userId, int week)
        {
            var client = await _supabaseFactory.CreateAsync();

            var result = await client
        .From<Games>()
        .Select("*")
        .Where(x => x.Week == week)

        .Get();
            Console.WriteLine(result);
            var gamesWithGuesses = result.Models.ToList();
            foreach (var game in gamesWithGuesses)
            {
                var guesses = game.Guesses;
                var userGuesses = guesses.Where(x => x.userId == userId).ToList();
                game.Guesses = userGuesses;
            }
            return gamesWithGuesses;
        }
        public async Task<Boolean> AddGuessAsync(Guess guess)
        {
            var client = await _supabaseFactory.CreateAsync();
            var result = await client.From<Guess>().Insert(guess);
            //Console.WriteLine(result);
            return true;
        }
    }
}
