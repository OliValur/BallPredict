using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
using Supabase;

namespace BallPredict.Backend.Services
{
    public class GuessService
    {
        private readonly ISupabaseClientFactory _supabaseFactory;


        public GuessService(ISupabaseClientFactory supabaseFactory)
        => _supabaseFactory = supabaseFactory;

        public async Task<List<Guess>> GetUserGuessesAsync()
        {
            var client = await _supabaseFactory.CreateAsync();
            var result = await client.From<Guess>().Get();
            return result.Models.ToList();
        }
    }
}
