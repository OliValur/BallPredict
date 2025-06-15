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

        // POST api/<LeagueMembershipController>/5
        [HttpPost("{leagueId}")]
        public async Task<IActionResult> Post([FromRoute] Guid leagueId)
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());
            LeagueMembers leagueMembers = new LeagueMembers
            {
                LeagueId = leagueId,
                PlayerId = userId
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
        [HttpPost("join-by-code")]
        public async Task<IActionResult> JoinByInviteCode([FromBody] JoinByCodeDto dto)
        {
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString());

            var league = await _leagueService.GetLeagueByInviteCode(dto.InviteCode);
            if (league == null)
            {
                return NotFound("League not found for the given invite code");
            }

            LeagueMembers leagueMember = new LeagueMembers
            {
                LeagueId = league.Id,
                PlayerId = userId
            };

            var result = await _leagueService.JoinLeague(leagueMember);
            if (result)
            {
                return Ok(new { message = "Joined league successfully", leagueId = league.Id });
            }
            else
            {
                return BadRequest("Failed to join league");
            }
        }
    }
}
