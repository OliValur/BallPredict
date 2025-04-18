using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
using BallPredict.Backend.DTOs;
using System.IdentityModel.Tokens.Jwt;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BallPredict.Backend
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuessesController : ControllerBase
    {
        private readonly GuessService _guessService;

        public GuessesController(GuessService guessService)
        {
            _guessService = guessService;
        }
        // GET: api/<GuessesController>
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
           
            var guesses = await _guessService.GetUserGuessesAsync();
            //Console.WriteLine(guesses);

            return Ok(guesses);
        }

        // POST api/<GuessesController>
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GuessDto guessDto)
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());

            //Console.WriteLine(userId);
            var Guess = new Guess
            {
                gameId = guessDto.GameId,
                userId = userId,
                guess = guessDto.Guess
            };
            var result = await _guessService.AddGuessAsync(Guess);
            return Ok(result);
        }

        // PUT api/<GuessesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] GuessDto guessDto)
        {
            // Update the guess with the given id. If game has started or ended, return 403 Forbidden
            // If the guess is not found, return 404 Not Found
            // If the guess is found, update it and return 200 OK
            return Ok();

        }


    }
}
