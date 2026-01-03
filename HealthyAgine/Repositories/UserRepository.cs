using HealthyAgine.Models;
using Microsoft.EntityFrameworkCore;
using HealthyAgine.Data;

namespace HealthyAgine.Repositories
{
	public class UserRepository : IUserRepository
	{
		private readonly HealthyAgineContext _context;

		public UserRepository(HealthyAgineContext context)
		{
			_context = context;
		}

		public async Task SaveUserAsync(UserDBSave user)
		{
			_context.Users.Add(user);
			await  _context.SaveChangesAsync();
		}
	}
}