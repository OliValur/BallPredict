using Supabase;
using Supabase.Postgrest.Models;

namespace BallPredict.Backend.Services

{
    public class SupabaseService
    {
        private Supabase.Client _client;

        public void SupabaseClientProvider(IConfiguration config)
        {
            var url = config["SUPABASE_URL"];
            var key = config["SUPABASE_KEY"];
            var options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = true
            };

            _client = new Supabase.Client(url, key, options);
            _client.InitializeAsync().Wait();
        }

        public Supabase.Client Client => _client;

    }
}
