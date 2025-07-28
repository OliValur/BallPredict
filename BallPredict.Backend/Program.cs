

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;
using System.Text;
using BallPredict.Backend.Services;


var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
Env.Load();
var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_SECRET_KEY");
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
// Add services to the container.


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "BallPredict API", Version = "v1" });

    // Add JWT auth support
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddControllers().AddNewtonsoftJson();


//Supabase related Services
builder.Services
    .Configure<SupabaseSettings>(builder.Configuration.GetSection("Supabase"));
builder.Services.AddHttpContextAccessor();
builder.Services
    .AddSingleton<ISupabaseClientFactory, SupabaseClientFactory>();


builder.Services.AddSingleton<GuessService>();
builder.Services.AddSingleton<LeagueService>();
builder.Services.AddSingleton<TeamService>();
builder.Services.AddSingleton<SeasonPredictionService>();

// Add JWT Authentication
builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.Authority = jwtIssuer; //  Needed to fetch JWKS

        x.TokenValidationParameters = new TokenValidationParameters
        {


            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,

            ValidateAudience = true,
            ValidAudience = config["JwtSettings:Audience"],

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true

        };
    });


builder.Services.AddAuthorization();
builder.Services.AddMemoryCache();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000", "https://www.nflguessr.com", "https://www.nflguessr.com/", "https://nfl-guesser-git-master-olafur-valur-sigurdssons-projects.vercel.app/") 
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});



var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);
// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
