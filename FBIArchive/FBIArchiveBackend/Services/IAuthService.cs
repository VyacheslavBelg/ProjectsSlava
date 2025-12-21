using FBIArchive.Models;

namespace FBIArchive.Services
{
    public interface IAuthService
    {
        Task<(bool IsSuccess, string ErrorMessage, User? User)> RegisterUserAsync(UserRegistrationDto dto);
        Task<string> LoginAsync(UserLoginDto dto);
    }
}