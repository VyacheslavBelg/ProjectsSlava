using HealthyAgine.Models;
using Microsoft.EntityFrameworkCore;
using HealthyAgine.Repositories;


namespace HealthyAgine.Services
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserOutputDto> Calculate(UserInputDto input)
        {
            var user = new User
            {
                Name = input.Name,
                ChronoAge = input.ChronoAge,
                Sex = input.Sex,
                HeightCm = input.HeightCm,
                Weight = input.Weight,
                Fat = input.Fat
            };

            float LBM = user.Weight * (1f - user.Fat / 100f);

            float Pers_BMR = 370f + 21.6f * LBM;

            float MbAge = 0f;

            if (user.Sex)
            {
                MbAge = ((10f * user.Weight) + (6.25f * user.HeightCm) - Pers_BMR + 5f) / 5f;
            }
            else
            {
                MbAge = ((10f * user.Weight) + (6.25f * user.HeightCm) - Pers_BMR - 161f) / 5f;
            }

            float deltaAge = MbAge - user.ChronoAge;

            string interpretation = "";

            if (deltaAge <= -5f)
                interpretation = "Отличное метаболическое здоровье";
            else if (deltaAge < -1.5f)
                interpretation = "Хорошее метаболическое здоровье";
            else if (Math.Abs(deltaAge) <= 1.5f)
                interpretation = "Среднее метаболическое здоровье";
            else if (deltaAge < 5f)
                interpretation = "Неоптимальное метаболическое здоровье";
            else
                interpretation = "Плохое метаболическое состояние";

            var save = new UserDBSave
            {
                Name = user.Name,
                Sex = user.Sex ? "Male" : "Female",
                Fat = user.Fat,
                ChronoAge = user.ChronoAge,
                MbAge = MbAge,
                deltaAge = deltaAge
            };

            await _userRepository.SaveUserAsync(save);

            var output = new UserOutputDto
            {
                MbAge = MbAge,
                DeltaAge = deltaAge,
                Interpretation = interpretation
            };

            return output;
        }
    }
}