using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BallPredict.Backend.Models;
using BallPredict.Backend.Services;

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
            /*
            var url = Environment.GetEnvironmentVariable("SUPABASE_URL");
            var key = Environment.GetEnvironmentVariable("SUPABASE_KEY");
            var options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = true
            };
            var supabase = new Supabase.Client(url, key, options);
            await supabase.InitializeAsync();
            
            var SupaService = new SupabaseService();
            var user_guesses = await supabase.From<Guess>().Get();


            Console.WriteLine(user_guesses);
            var guess = user_guesses.Models;
            var guessList = new List<Guess>();
            foreach (var g in guess)
            {
                guessList.Add(g);
            }
            */
            var guesses = await _guessService.GetUserGuessesAsync();
            Console.WriteLine(guesses);

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
        public void Post([FromBody] string value)
        {
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
