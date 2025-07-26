using BallPredict.Backend.Models;
using Microsoft.Extensions.Caching.Memory;
using Supabase;
using static Supabase.Postgrest.Constants;
using BallPredict.Backend.DTOs;

namespace BallPredict.Backend.Services
{
    public class SeasonPredictionService
    {
        private readonly Client _supabaseClient;
        private readonly IMemoryCache _cache;

        public SeasonPredictionService(ISupabaseClientFactory factory, IMemoryCache cache)
        {
            _supabaseClient = factory.CreateAsync().GetAwaiter().GetResult();
            _cache = cache;
        }

      

        public async Task<SeasonGuesses> GetUserPrediction(string userId)
        {
            if (_cache.TryGetValue($"season_guesses_{userId}", out SeasonGuesses cached))
                return cached;

            var result = await _supabaseClient
                .From<SeasonGuesses>()
                .Where(g => g.UserId == userId)
                .Get();

            var guess = result.Models.FirstOrDefault();
            _cache.Set($"season_guesses_{userId}", guess, TimeSpan.FromMinutes(30));
            return guess;
        }

        public async Task<bool> SubmitSeasonResults(SeasonResults results)
        {
            try
            {
                var existing = await _supabaseClient.From<SeasonResults>().Get();
                if (existing.Models.Any())
                {
                    var id = existing.Models.First().Id;
                    await _supabaseClient
                        .From<SeasonResults>()
                        .Where(r => r.Id == id)
                        .Update(results);
                }
                else
                {
                    await _supabaseClient.From<SeasonResults>().Insert(results);
                }

                _cache.Remove("season_results");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error saving results: " + ex.Message);
                return false;
            }
        }

        public async Task<SeasonResults> GetSeasonResults()
        {
            if (_cache.TryGetValue("season_results", out SeasonResults cached))
                return cached;

            var result = await _supabaseClient.From<SeasonResults>().Get();
            var data = result.Models.FirstOrDefault();
            _cache.Set("season_results", data, TimeSpan.FromHours(1));
            return data;
        }
        public async Task<bool> SubmitSeasonPrediction(string category, string guess, string userId)
        {
            try
            {
                var existing = await _supabaseClient
                    .From<SeasonGuesses>()
                    .Where(g => g.UserId == userId)
                    .Get();
                SeasonGuesses model;
                model = existing.Models.First();
                if (!UpdateDependingOnParam( category, guess, model))
                {
                    Console.WriteLine("Invalid category provided: " + category);
                    return false; // Invalid category
                }
                model.UserId = userId;
                await model.Update<SeasonGuesses>();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error submitting prediction: " + ex.Message);
                return false;
            }
        }
        private static bool UpdateDependingOnParam(string category, string guess, SeasonGuesses model)
        {
            switch (category)
            {
                case "AfcNorth":
                    model.AfcNorth = guess;
                    break;
                case "AfcSouth":
                    model.AfcSouth = guess;
                    break;
                case "AfcEast":
                    model.AfcEast = guess;
                    break;
                case "AfcWest":
                    model.AfcWest = guess;
                    break;
                case "NfcNorth":
                    model.NfcNorth = guess;
                    break;
                case "NfcSouth":
                    model.NfcSouth = guess;
                    break;
                case "NfcEast":
                    model.NfcEast = guess;
                    break;
                case "NfcWest":
                    model.NfcWest = guess;
                    break;
                case "SeasonMvp":
                    model.SeasonMvp = guess;
                    break;
                case "RookieOfTheYear":
                    model.RookieOfTheYear = guess;
                    break;
                case "RushingLeader":
                    model.RushingChampion = guess;
                    break;
                case "ReceivingLeader":
                    model.MostReceivingYards = guess;
                    break;
                case "PassingLeader":
                    model.MostPassingYards = guess;
                    break;
                case "AfcFirstSeed":
                    model.AfcFirstSeed = guess;
                    break;
                case "NfcFirstSeed":
                    model.NfcFirstSeed = guess;
                    break;
                case "SuperBowlWinner":
                    model.SuperBowlChamp = guess;
                    break;
                default:
                    return false; // invalid category
            }
            return true; // valid category
        }
    }
}
