using Microsoft.AspNetCore.Mvc;
using BallPredict.Backend.Services;
using BallPredict.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace BallPredict.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous] // TODO: Verja þennan endapunkt, Clerk sendir ekki JWT með
    public class ClerkWebhookController : BaseController
    {
        private readonly TeamService _teamService;

        public ClerkWebhookController(TeamService teamService)
        {
            _teamService = teamService;
        }

        public class ClerkUserCreatedPayload
        {
            public string Type { get; set; }
            public ClerkUser Data { get; set; }
        }

        public class ClerkUser
        {
            public string Id { get; set; }
            public string Username { get; set; }
            public Points Points { get; set; } = new Points();
        }

        [HttpPost]
        public async Task<IActionResult> HandleWebhook([FromBody] ClerkUserCreatedPayload payload)
        {
            //Console.WriteLine("Received Clerk webhook event: " + payload.Type + ", Data er: " + JsonSerializer.Serialize(payload.Data));

            if (payload.Type != "user.created")
                return Ok("Ignored non-user.created event");

            if (string.IsNullOrWhiteSpace(payload.Data?.Id))
                return BadRequest("Missing user ID");

            var team = new Teams
            {
                Id = payload.Data.Id,
                Team = payload.Data.Username ?? "Unnamed",
                Points = payload.Data.Points ?? new Points()
            };

            var result = await _teamService.AddTeam(team);

            return result != null
                ? Ok("Team created")
                : StatusCode(500, "Failed to create team");
        }
    }
}
