using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BallPredict.Backend.Services;
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
    /// Factory that gives you a Supabase client, already authenticated with the current user's JWT.
    /// </summary>
    public interface ISupabaseClientFactory
    {
        /// <summary>
        /// Creates and initializes a new <see cref="Client"/> instance scoped to the current HTTP request.
        /// </summary>
        /// <returns>An initialized and authenticated <see cref="Client"/>.</returns>
        Task<Client> CreateAsync();
    }

    /// <inheritdoc/>
    public class SupabaseClientFactory : ISupabaseClientFactory
    {
        private readonly SupabaseSettings _settings;
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// Initializes a new instance of <see cref="SupabaseClientFactory"/>.
        /// </summary>
        /// <param name="settings">Injected Supabase settings from configuration.</param>
        /// <param name="httpContextAccessor">Accessor to get the current HTTP context and its headers.</param>
        public SupabaseClientFactory(
            IOptions<SupabaseSettings> settings,
            IHttpContextAccessor httpContextAccessor)
        {
            _settings = settings.Value;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <inheritdoc/>
        public async Task<Client> CreateAsync()
        {
            // 1) Validate config
            if (string.IsNullOrWhiteSpace(_settings.Url) ||
                string.IsNullOrWhiteSpace(_settings.Key))
            {
                throw new InvalidOperationException("Supabase URL or Key is not configured.");
            }

            // 2) Spin up a fresh client
            var options = new SupabaseOptions { AutoConnectRealtime = false };
            var client = new Client(_settings.Url, _settings.Key, options);

            // 3) Initialize connection (async)
            await client.InitializeAsync();

            // 4) Authenticate from the incoming JWT
            var authHeader = _httpContextAccessor.HttpContext?
                .Request.Headers["Authorization"]
                .ToString();
            var refreshHeader = _httpContextAccessor.HttpContext?
                .Request.Headers["x-refresh-token"]
                .ToString();
            var token = authHeader?.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
            System.Console.WriteLine(authHeader);

            //await client.Auth.SetSession(token, refreshHeader);


            return client;
        }
    }
}
