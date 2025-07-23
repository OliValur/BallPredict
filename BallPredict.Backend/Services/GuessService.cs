using BallPredict.Backend.Models;
using Microsoft.Extensions.Caching.Memory;
using static Supabase.Postgrest.Constants;


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

        /// <summary>
        /// Gets all guesses for a specific league.
        /// </summary>
        /// <param name="userIds">A string list of the user ids in the league</param>
        /// <param name="leagueId">The Guid of the league</param>
        /// <returns>TBD</returns>
        public async Task<List<Guess>> GetGuessesByUserIds(List<string> userIds, Guid leagueId)
        {
            // Check if the guesses are in the cache
            if (_memoryCache.TryGetValue($"guesses_{leagueId}", out List<Guess> cachedGuesses))
            {
                return cachedGuesses.Where(g => userIds.Contains(g.userId)).ToList();
            }
            Console.WriteLine("Hér" + userIds + leagueId);
            var guesses = await _supabaseClient
                .From<Guess>()
                .Select("*")
                .Filter(x => x.userId, Operator.In, userIds)
                .Get();
            // Cache the guesses for 60 minutes
            _memoryCache.Set($"guesses_{leagueId}", guesses.Models.ToList(), new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(5)
            });
            Console.WriteLine(guesses);
            return guesses.Models.ToList();
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
