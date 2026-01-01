using FBIArchive.Models;
using FBIArchive.Repositories;
using BCrypt.Net;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;

namespace FBIArchive.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration; 

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<(bool IsSuccess, string ErrorMessage, User? User)> RegisterUserAsync(UserRegistrationDto dto)
        {

            if (await _userRepository.EmailExistsAsync(dto.Email))
            {
                return (false, "Агент с таким Email уже существует в архиве.", null);
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var newUser = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                HashPassword = passwordHash,
                RegistrationDate = DateTime.UtcNow,
                Role = "Обычный" 
            };


            await _userRepository.AddUserAsync(newUser);

            return (true, "", newUser);
        }

        public async Task<string> LoginAsync(UserLoginDto dto)
        {
            
            var user = await _userRepository.GetUserByEmailAsync(dto.Email);

            
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.HashPassword))
            {
                return "Error: Неверный email или пароль."; 
            }

           
            string token = CreateToken(user);
            return token;
        }

        private string CreateToken(User user)
        {
           
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role) 
        };

           
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("JwtSettings:Key").Value!));

            
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1), 
                signingCredentials: creds,
                issuer: _configuration.GetSection("JwtSettings:Issuer").Value,
                audience: _configuration.GetSection("JwtSettings:Audience").Value
            );

            
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}