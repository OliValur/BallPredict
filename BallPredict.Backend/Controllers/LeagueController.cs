using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
using BallPredict.Backend.DTOs;
using System.IdentityModel.Tokens.Jwt;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BallPredict.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeagueController : ControllerBase
    {

        private readonly LeagueService _leagueService;
        public LeagueController(LeagueService leagueService)
        {
            _leagueService = leagueService;
        }
        // GET: api/<LeagueController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<LeagueController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<LeagueController>
        [HttpPost]
        public async Task<IActionResult> Post(string name, string sport_type)
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());
            var league = new Leagues
            {
                Name = name,
                Sport = sport_type,
                OwnerId = userId
            };
            var createdLeague = await _leagueService.CreateLeague(league);
            if (createdLeague != null)
            {
                return Ok(createdLeague);
            }
            else
            {
                return BadRequest("Failed to create league");
            }
        }

        // PUT api/<LeagueController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<LeagueController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
