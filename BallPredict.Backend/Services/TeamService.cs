using BallPredict.Backend.DTOs;
using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
using Microsoft.Extensions.Caching.Memory;

//using Postgrest.Constants;
using Supabase;

namespace BallPredict.Backend.Services
{

    public class TeamService
    {
        private readonly Client _supabaseClient;
        private readonly IMemoryCache _memoryCache;


        public TeamService(ISupabaseClientFactory supabaseFactory, IMemoryCache memoryCache)
        {
            _supabaseClient = supabaseFactory.CreateAsync().GetAwaiter().GetResult();
            _memoryCache = memoryCache;
        }



        public async Task<Teams> AddTeam(Teams team)
        {
            try
            {
                var result = await _supabaseClient.From<Teams>()
                    .Insert(team);
                var createdTeam = result.Models.FirstOrDefault();
                return createdTeam;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error creating team: " + ex.Message);
                return null;
            }
        }
    }
}