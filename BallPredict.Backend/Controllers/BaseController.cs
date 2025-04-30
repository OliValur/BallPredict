using BallPredict.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BallPredict.Backend.Controllers
{
    [Authorize]
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected string GetUserId()
        {
            var authHeader = Request.Headers["Authorization"].ToString();

            if (string.IsNullOrWhiteSpace(authHeader))
                throw new UnauthorizedAccessException("Authorization header missing.");

            var userIdString = JwtHelper.GetUserIdFromToken(authHeader);
            /*
            if (!Guid.TryParse(userIdString, out var userId))
                throw new UnauthorizedAccessException("Invalid user ID.");
            */
            return userIdString;
        }
    }
}
