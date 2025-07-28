using BallPredict.Backend.DTOs;
using BallPredict.Backend.Services;
using BallPredict.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BallPredict.Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SeasonPredictionController : ControllerBase
    {
        private readonly SeasonPredictionService _service;

        public SeasonPredictionController(SeasonPredictionService service)
        {
            _service = service;
        }
        public class SeasonPredictionInput
        {
            public string Category { get; set; }
            public string Guess { get; set; }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SeasonPredictionInput input)
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());

            var success = await _service.SubmitSeasonPrediction(input.Category, input.Guess, userId);

            if (!success)
                return StatusCode(500, "Failed to save season predictions");

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());
            var result = await _service.GetUserPrediction(userId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("league/{leagueId}")]
        public async Task<IActionResult> GetLeagueSeasonPredictions([FromRoute] Guid leagueId)
        {
            var predictions = await _service.GetSeasonPredictionsByLeagueAsync(leagueId);
            return Ok(predictions);
        }
    }
}
