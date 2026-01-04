using HealthyAgine.Models;

namespace HealthyAgine.Services
{
    public interface IUserService
    {
        Task<UserOutputDto> Calculate(UserInputDto input);
        Task<UserOutputDto> CalculateWithFat(UserInputDto input, PersonParametrs parametrs);
    }
}