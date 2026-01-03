using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Collections.Concurrent;
using ChatServer.Models;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private static readonly ConcurrentDictionary<string, UserAccount> _userDb = new();

    
    private const string SecretKey = "SuperSecretKeyForChatApp12345!SuperSecretKeyForChatApp12345!";

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDto request)
    {
        if (_userDb.ContainsKey(request.Username))
            return BadRequest("Пользователь уже существует");

        var user = new UserAccount
        {
            Username = request.Username,
            PasswordHash = HashPassword(request.Password)
        };

        _userDb[request.Username] = user;
        return Ok("Пользователь зарегистрирован");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto request)
    {
        if (!_userDb.TryGetValue(request.Username, out var user))
            return Unauthorized("Неверный логин");

        if (user.PasswordHash != HashPassword(request.Password))
            return Unauthorized("Неверный пароль");

        var tokens = GenerateTokens(user.Username);

        
        user.RefreshToken = tokens.RefreshToken;
        user.RefreshTokenExpiry = DateTime.Now.AddDays(7); 

        return Ok(tokens);
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshTokenRequest request)
    {
        var principal = GetPrincipalFromExpiredToken(request.AccessToken);
        if (principal == null) return BadRequest("Невалидный токен");

        var username = principal.Identity?.Name;
        if (username == null || !_userDb.TryGetValue(username, out var user))
            return BadRequest("Пользователь не найден");

        if (user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiry <= DateTime.Now)
            return BadRequest("Невалидный или истекший Refresh token");

        var newTokens = GenerateTokens(username);
        user.RefreshToken = newTokens.RefreshToken;
        user.RefreshTokenExpiry = DateTime.Now.AddDays(7);

        return Ok(newTokens);
    }


    private TokenDto GenerateTokens(string username)
    {
        var claims = new[] { new Claim(ClaimTypes.Name, username) };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


        var token = new JwtSecurityToken(
            issuer: "ChatServer",
            audience: "ChatClient",
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds
        );

        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        return new TokenDto
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
            RefreshToken = refreshToken,
            Username = username
        };
    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)),
            ValidateLifetime = false 
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
        catch
        {
            return null;
        }
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}