using System.IdentityModel.Tokens.Jwt;

namespace BallPredict.Backend.Services
{
    public static class JwtHelper
    {
        /// <summary>
        /// Extracts the user ID from a JWT token.
        /// </summary>
        /// <param name="token">JWT token from Clerk</param>
        /// <returns>The "sub" field in the payload from the JWT</returns>
        public static string GetUserIdFromToken(string bearerToken)
        {
            string token = bearerToken.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);
            var userId = jwt.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedAccessException("User not valid");
            return userId;
        }
        public static string GetRefreshToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);
            var refreshToken = jwt.Claims.FirstOrDefault(c => c.Type == "refresh_token")?.Value;

            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new UnauthorizedAccessException("Refresh token missing from x-refresh-token header.");
            return refreshToken;
        }
    }
}
