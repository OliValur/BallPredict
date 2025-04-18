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

        // GET api/<GuessesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            Console.WriteLine(id);
            return "value";
        }

        // POST api/<GuessesController>
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
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<GuessesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
