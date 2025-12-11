using FBIArchive.Models;

namespace FBIArchive.Repositories
{
    public interface IUserRepository
    {
        Task<bool> EmailExistsAsync(string email);
        Task AddUserAsync(User user);
    }
}