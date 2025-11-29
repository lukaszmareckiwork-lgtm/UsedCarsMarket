using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Interfaces;
using api.Models;
using Microsoft.IdentityModel.Tokens;
using api.Options;

namespace api.Service
{
    public class TokenService : ITokenService
    {
        private readonly JwtOptions _jwtOptions;
        private readonly SymmetricSecurityKey _key;

        public TokenService(Microsoft.Extensions.Options.IOptions<api.Options.JwtOptions> options)
        {
            _jwtOptions = options?.Value ?? throw new ArgumentNullException(nameof(options));
            if (string.IsNullOrEmpty(_jwtOptions.SigningKey))
                throw new ArgumentException("JWT SigningKey is not configured.");

            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SigningKey));
        }

        public string CreateToken(AppUser user)
        {
            // defensive null handling for user properties
            var email = user?.Email ?? string.Empty;
            var username = user?.UserName ?? string.Empty;

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.GivenName, username),
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _jwtOptions.Issuer,
                Audience = _jwtOptions.Audience,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}