

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;
using System.Text;
using BallPredict.Backend.Services;


var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
Env.Load();
var supabaseKey = Environment.GetEnvironmentVariable("SUPABASE_SECRET_KEY");

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

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = ctx =>
        {
            //Console.WriteLine($"[Jwt] Authorization header: {ctx.Request.Headers["Authorization"]}");
            return Task.CompletedTask;
        },
        OnTokenValidated = ctx =>
        {
            //Console.WriteLine($"[Jwt]  Token validated for {ctx.Principal.Identity.Name}");
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = ctx =>
        {
            //Console.WriteLine($"[Jwt]  Authentication failed: {ctx.Exception?.Message}");
            return Task.CompletedTask;
        }
    };
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(supabaseKey)),
        ValidateIssuer = false,
        ValidIssuer = "https://dykipnmqxaxdddzdnqpf.supabase.co",
        ValidateAudience = false,
        // Supabase tokens use "authenticated" as their `aud` claim for user sessions
        ValidAudience = "authenticated",
        ValidateLifetime = false
    };
});


builder.Services.AddAuthorization();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000", "http://localhost:3000/api/guess") 
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
