using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Supabase;

namespace BallPredict.Backend.Services
{
    /// <summary>
    /// Settings required to connect to Supabase.
    /// </summary>
    public class SupabaseSettings
    {
        /// <summary>Base URL of your Supabase project.</summary>
        public string Url { get; set; } = Environment.GetEnvironmentVariable("SUPABASE_URL");

        /// <summary>Service role key or anon key for your Supabase project.</summary>
        public string Key { get; set; } = Environment.GetEnvironmentVariable("SUPABASE_KEY");
    }

    /// <summary>
    /// Factory that gives you a Supabase client. Internally uses service role only (not user auth).
    /// </summary>
    public interface ISupabaseClientFactory
    {
        /// <summary>
        /// Returns a singleton instance of a Supabase client.
        /// </summary>
        Task<Client> CreateAsync();
    }

    public class SupabaseClientFactory : ISupabaseClientFactory
    {
        private readonly SupabaseSettings _settings;

        // Lazily created Supabase client
        private Client? _client;
        private bool _initialized;
        private readonly SemaphoreSlim _initLock = new(1, 1); // Used to avoid race conditions

        public SupabaseClientFactory(
            IOptions<SupabaseSettings> settings,
            IHttpContextAccessor _ // no longer needed but preserved for DI compatibility
        )
        {
            _settings = settings.Value;
        }

        public async Task<Client> CreateAsync()
        {
            // Fast path: return client if already initialized
            if (_initialized && _client != null)
                return _client;

            await _initLock.WaitAsync();
            try
            {
                if (_initialized && _client != null)
                    return _client; // another thread may have initialized while we waited

                if (string.IsNullOrWhiteSpace(_settings.Url) ||
                    string.IsNullOrWhiteSpace(_settings.Key))
                {
                    throw new InvalidOperationException("Supabase URL or Key is not configured.");
                }

                var options = new SupabaseOptions
                {
                    AutoConnectRealtime = false
                };

                _client = new Client(_settings.Url, _settings.Key, options);
                await _client.InitializeAsync();

                _initialized = true;

                return _client;
            }
            finally
            {
                _initLock.Release();
            }
        }
    }
}
