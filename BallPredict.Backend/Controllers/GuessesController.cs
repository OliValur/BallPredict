using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
using BallPredict.Backend.DTOs;
using System.IdentityModel.Tokens.Jwt;
using BallPredict.Backend.Controllers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BallPredict.Backend
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuessesController : BaseController
    {
        private readonly GuessService _guessService;

        public GuessesController(GuessService guessService)
        {
            _guessService = guessService;
        }
        // GET: api/<GuessesController>
        [Authorize]
        [HttpGet("week/{week}")]
        public async Task<IActionResult> Get([FromRoute] int week)
        {
            var userId = GetUserId();
            var guesses = await _guessService.GetUserGuessesAsync(userId, week);
            return Ok(guesses);
        }

        // GET: api/<GuessesController>/league/{leagueId}
        /*
        [Authorize]
        [HttpGet("league/{leagueId}")]

        public async Task<IActionResult> Get(Guid leagueGuid, [FromHeader(Name = "x-refresh-token")] string refreshToken)
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());
            var guesses = await _guessService.GetUserGuessesAsync(userId);
            Console.WriteLine(guesses);

            return Ok(guesses);
        }
        */
        // POST api/<GuessesController>
        
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GuessDto guessDto)
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization);

            //Console.WriteLine(userId);
            var Guess = new Guess
            {
                gameId = guessDto.GameId,
                userId = userId,
                guess = guessDto.Prediction
            };
            var result = await _guessService.AddGuessAsync(Guess);
            return Ok(result);
        }

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody] GuessDto guessDto)
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization);
            var Guess = new Guess
            {
                gameId = guessDto.GameId,
                userId = userId,
                guess = guessDto.Prediction
            };
            var result = await _guessService.UpdateGuess(Guess);
            return Ok(result);
        }

        /*
        // PUT api/<GuessesController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] GuessDto guessDto)
        {
            // Update the guess with the given id. If game has started or ended, return 403 Forbidden
            // If the guess is not found, return 404 Not Found
            // If the guess is found, update it and return 200 OK
            return Ok();

        }
        */

    }
}
