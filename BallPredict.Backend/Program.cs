

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
Env.Load();
string clerkKey = Environment.GetEnvironmentVariable("CLERK_SECRET_KEY");
Console.WriteLine(clerkKey);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add JWT Authentication
builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.Authority = config["JwtSettings:Issuer"]; //  Needed to fetch JWKS
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = config["JwtSettings:Issuer"],

            ValidateAudience = true,
            ValidAudience = config["JwtSettings:Audience"],

            ValidateIssuerSigningKey = true,
            ValidateLifetime = true
            //  Do NOT set IssuerSigningKey manually for RS256
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
                .WithOrigins("http://localhost:3000") // or your frontend origin
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
