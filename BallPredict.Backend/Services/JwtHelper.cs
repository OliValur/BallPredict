using Microsoft.IdentityModel.JsonWebTokens;

namespace BallPredict.Backend.Services
{
    public static class JwtHelper
    {
        /// <summary>
        /// Extracts the user ID ("sub") from a JWT bearer token.
        /// </summary>
        public static string GetUserIdFromToken(string bearerToken)
        {
            if (string.IsNullOrWhiteSpace(bearerToken))
                throw new UnauthorizedAccessException("Missing Authorization header.");

            var token = bearerToken.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase).Trim();

            var handler = new JsonWebTokenHandler();
            var jwt = handler.ReadJsonWebToken(token); // no validation, just parse

            var userId = jwt?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedAccessException("User not valid");

            return userId;
        }

        /// <summary>
        /// Clerk does NOT put a refresh token inside the access token.
        /// If you’re passing a refresh token, it’s usually in a separate header/cookie.
        /// Keep this only if you truly embed it in a custom JWT.
        /// </summary>
        public static string GetRefreshToken(string token)
        {
            var handler = new JsonWebTokenHandler();
            var jwt = handler.ReadJsonWebToken(token);
            var refreshToken = jwt?.Claims.FirstOrDefault(c => c.Type == "refresh_token")?.Value;

            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new UnauthorizedAccessException("Refresh token missing from x-refresh-token header.");

            return refreshToken;
        }
    }
}
