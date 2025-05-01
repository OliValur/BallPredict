using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Caching.Memory;


//using Postgrest.Constants;
using Supabase;
using static Supabase.Postgrest.Constants;

namespace BallPredict.Backend.Services
{
    public class GuessService
    {
        private readonly Client _supabaseClient;
        private readonly IMemoryCache _memoryCache;


        public GuessService(ISupabaseClientFactory supabaseFactory, IMemoryCache memoryCache)
        {
            _supabaseClient = supabaseFactory.CreateAsync().GetAwaiter().GetResult();
            _memoryCache = memoryCache;
        }
        public async Task<List<Games>> GetUserGuessesAsync(string userId, int week)
        {
            // Check if the games are in the cache
            if (!_memoryCache.TryGetValue($"games_week_{week}", out List<Games> cachedGames))
            {
                // If not, fetch from the database
                var games = await _supabaseClient
                    .From<Games>()
                    .Select("*")
                    .Where(x => x.Week == week)
                    .Get();
                cachedGames = games.Models.ToList();
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5));
                _memoryCache.Set($"games_week_{week}", cachedGames, cacheOptions);

                Console.WriteLine("Fetched from database");
            }
            var gamesList = cachedGames;
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
