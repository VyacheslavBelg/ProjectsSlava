using FBIArchive.Data;
using FBIArchive.Models;
using Microsoft.EntityFrameworkCore;

namespace FBIArchive.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly FBIArchiveContext _context;

        public UserRepository(FBIArchiveContext context)
        {
            _context = context;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

    }
}