using FBIArchive.Models;
using FBIArchive.Repositories;
using BCrypt.Net;

namespace FBIArchive.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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
    }
}