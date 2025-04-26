using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BallPredict.Backend.Models;
using BallPredict.Backend.Services;
using BallPredict.Backend.DTOs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BallPredict.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeagueMembershipController : ControllerBase
    {

        private readonly LeagueService _leagueService;
        public LeagueMembershipController(LeagueService leagueService)
        {
            _leagueService = leagueService;
        }
        // GET: api/<LeagueMembershipController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<LeagueMembershipController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<LeagueMembershipController>/5
        [HttpPost("{leagueId}")]
        public async Task<IActionResult> Post([FromRoute] Guid leagueId)
        {
            Console.WriteLine(leagueId);

            var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());
            Guid userGuid = Guid.Parse(userId);
            LeagueMembers leagueMembers = new LeagueMembers
            {
                LeagueId = leagueId,
                PlayerId = userGuid
            };
            var result = await _leagueService.JoinLeague(leagueMembers);
            if (result)
            {
                return Ok(new { message = "Joined league successfully" });
            }
            else
            {
                return BadRequest("Failed to join league");
            }
        }

        // PUT api/<LeagueMembershipController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<LeagueMembershipController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
