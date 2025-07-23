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
        public async Task<List<Leagues>> Get()
        {
            var leagues = new List<Leagues>();
            string  userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());
            leagues = await _leagueService.GetLeaguesByUserId(userId);
            return leagues;
        }
        
        // GET api/<LeagueController>/5
        [HttpGet("{id}")]
        public async Task<List<TeamsDto>> Get(Guid id)
        {
            var teams = await _leagueService.GetLeagueById(id);
            return teams;
        }
        

        // POST api/<LeagueController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] LeagueDto leagueDto)
        {
            var league = new Leagues
            {
                Name = leagueDto.Name,
                OwnerId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString())
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

        
        /*
        // POST api/<LeagueController>/join/code/5
        [HttpPost("join/code/{code}")]
        public async Task<IActionResult> Post([FromBody] string leagueCode)
        {
            var result = await _leagueService.JoinLeagueByCode(leagueCode);
            if (result)
            {
                return Ok(new { message = "Joined league successfully" });
            }
            else
            {
                return BadRequest("Failed to join league");
            }
        }
        */
        /*
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
        */
    }
}
