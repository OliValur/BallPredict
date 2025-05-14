using BallPredict.Backend.DTOs;
using Microsoft.AspNetCore.Mvc;

using BallPredict.Backend.Services;
using System.IdentityModel.Tokens.Jwt;
using BallPredict.Backend.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BallPredict.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class TeamController : BaseController
    {
        private readonly TeamService _teamService;

        public TeamController(TeamService teamService)
        {
            _teamService = teamService;
        }

        // GET: api/<TeamController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<TeamController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<TeamController>
        [HttpPost]
        public void Post([FromBody] TeamsDto teamDto)
        {
            Console.WriteLine("Hæ");
            var userId = JwtHelper.GetUserIdFromToken(Request.Headers.Authorization);
            var team = new Teams
            {
                Team = teamDto.Team,
                Id = userId
            };
            Console.WriteLine(team.Id);
            var result = _teamService.AddTeam(team);
        }

        // PUT api/<TeamController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<TeamController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
