using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;
using DotNetEnv;
using BallPredict.Backend.Services;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// ---- Load .env from common locations ----
string? loadedFrom = null;
string Try(string p) => Path.Combine(p, ".env");
foreach (var p in new[] {
    Try(builder.Environment.ContentRootPath),
    Try(Directory.GetCurrentDirectory()),
    Try(AppContext.BaseDirectory)
})
{
    if (File.Exists(p)) { Env.Load(p); loadedFrom = p; break; }
}
if (loadedFrom is null) { Env.Load(); loadedFrom = "<process env only>"; }
Console.WriteLine($"[Env] .env source: {loadedFrom}");

// ---- Read env/config ----
var issuer = (Environment.GetEnvironmentVariable("JWT_ISSUER") ?? config["JWT_ISSUER"] ?? "").TrimEnd('/');
var audience = config["JwtSettings:Audience"] ?? "authenticated";
if (string.IsNullOrWhiteSpace(issuer))
    throw new InvalidOperationException("JWT_ISSUER is not set.");

Console.WriteLine($"[Auth] Issuer='{issuer}'  Audience='{audience}'");

// Avoid inbound claim remapping
JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();

// ---- PRELOAD JWKS (use this for validation immediately) ----
var jwksUrl = $"{issuer}/.well-known/jwks.json";
List<SecurityKey> signingKeys;
try
{
    using var http = new HttpClient();
    var jwksJson = await http.GetStringAsync(jwksUrl);
    var jwks = new JsonWebKeySet(jwksJson);
    signingKeys = jwks.GetSigningKeys().ToList();
    Console.WriteLine($"[Auth] JWKS preload: {signingKeys.Count} key(s) [{string.Join(",", signingKeys.Select(k => k.KeyId))}]");
}
catch (Exception ex)
{
    Console.WriteLine($"[Auth] JWKS preload FAILED: {ex.Message}");
    signingKeys = new List<SecurityKey>();
}

// ---- Services ----
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "BallPredict API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Name = "Authorization",
        Description = "Paste a valid JWT."
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        { new Microsoft.OpenApi.Models.OpenApiSecurityScheme { Reference = new Microsoft.OpenApi.Models.OpenApiReference
            { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } }, Array.Empty<string>() }
    });
});

// Supabase & your services
builder.Services.Configure<SupabaseSettings>(builder.Configuration.GetSection("Supabase"));
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<ISupabaseClientFactory, SupabaseClientFactory>();
builder.Services.AddSingleton<GuessService>();
builder.Services.AddSingleton<LeagueService>();
builder.Services.AddSingleton<TeamService>();
builder.Services.AddSingleton<SeasonPredictionService>();

// ---- Authentication (use JWKS directly) ----
builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.RequireHttpsMetadata = true;

    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer,

        ValidateAudience = true,
        ValidAudience = audience,          // your token's "aud": "authenticated"

        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2),

        ValidateIssuerSigningKey = true,

        // Use the preloaded keys immediately (prevents "no keys" at first request)
        IssuerSigningKeys = signingKeys,

        // On demand: fetch fresh JWKS (handles rotation or preload failures)
        IssuerSigningKeyResolver = (token, st, kid, p) =>
        {
            try
            {
                // Prefer matching preloaded key
                if (!string.IsNullOrEmpty(kid))
                {
                    var match = signingKeys.Where(k => (k.KeyId ?? "") == kid);
                    if (match.Any())
                    {
                        Console.WriteLine($"[Auth] Resolver: using preloaded kid '{kid}'.");
                        return match;
                    }
                }

                // Fetch latest JWKS now
                using var http = new HttpClient();
                var json = http.GetStringAsync(jwksUrl).GetAwaiter().GetResult();
                var keys = new JsonWebKeySet(json).GetSigningKeys();

                // Update our in-memory list for future requests
                signingKeys = keys.ToList();

                if (!string.IsNullOrEmpty(kid))
                {
                    var match2 = keys.Where(k => (k.KeyId ?? "") == kid);
                    if (match2.Any())
                    {
                        Console.WriteLine($"[Auth] Resolver: fetched and matched kid '{kid}'.");
                        return match2;
                    }
                }

                Console.WriteLine($"[Auth] Resolver: fetched {keys.Count} key(s), returning all.");
                return keys;
            }
            catch (Exception e)
            {
                Console.WriteLine($"[Auth] Resolver error: {e.Message}");
                return Array.Empty<SecurityKey>();
            }
        },

        // Restrict alg
        ValidAlgorithms = new[] { SecurityAlgorithms.RsaSha256 }
    };

    o.RefreshOnIssuerKeyNotFound = true;

    o.Events = new JwtBearerEvents
    {
        OnMessageReceived = ctx =>
        {
            var auth = ctx.Request.Headers.Authorization.ToString();
            if (string.IsNullOrWhiteSpace(auth)) Console.WriteLine("[Auth] No Authorization header.");
            else
            {
                var token = auth.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) ? auth[7..] : auth;
                var parts = token.Split('.');
                Console.WriteLine($"[Auth] token segments={parts.Length}");
                if (parts.Length == 3)
                {
                    try
                    {
                        var headerJson = System.Text.Encoding.UTF8.GetString(Base64UrlEncoder.DecodeBytes(parts[0]));
                        Console.WriteLine($"[Auth] token header: {headerJson}");
                    }
                    catch { /* ignore */ }
                }
            }
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = ctx =>
        {
            Console.WriteLine($"[Auth] JWT auth failed: {ctx.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = ctx =>
        {
            Console.WriteLine("[Auth] JWT token validated.");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();
builder.Services.AddMemoryCache();

// ---- CORS ----
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://www.nflguessr.com",
                "https://www.nflguessr.com/",
                "https://nfl-guesser-git-master-olafur-valur-sigurdssons-projects.vercel.app/",
                "https://nfl-guesser-git-master-olafur-valur-sigurdssons-projects.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // simple diag
    app.MapGet("/_auth/diag", () => Results.Ok(new
    {
        issuer,
        audience,
        preloadedKids = signingKeys.Select(k => k.KeyId).ToArray()
    }));
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
