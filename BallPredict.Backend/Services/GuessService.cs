using BallPredict.Backend.Models;
using Microsoft.Extensions.Caching.Memory;


//using Postgrest.Constants;
using Supabase;

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
                    .SetSlidingExpiration(TimeSpan.FromMinutes(60));
                _memoryCache.Set($"games_week_{week}", cachedGames, cacheOptions);

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
            //TODO check if the guess was added successfully
            return true;
        }

        public async Task<Boolean> UpdateGuess(Guess guess)
        {
            var result = await _supabaseClient.From<Guess>().Where(x => x.gameId == guess.gameId && x.userId == guess.userId).Set(x => x.guess,  guess.guess).Update();

            return true;
        }
    }
}
