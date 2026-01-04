using HealthyAgine.Models;


namespace HealthyAgine.Repositories
{
    public interface IUserRepository
    {
        Task SaveUserAsync(UserDBSave user);
    }
}