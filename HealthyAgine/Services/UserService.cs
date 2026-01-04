using HealthyAgine.Models;
using Microsoft.EntityFrameworkCore;
using HealthyAgine.Repositories;
using Microsoft.VisualBasic.FileIO;
using System.Reflection.Metadata.Ecma335;


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

        public async Task<UserOutputDto> CalculateWithFat(UserInputDto input, PersonParametrs parametrs)
        {
            double Fat;

            if (input.Sex) 
            {
                
                double waist = parametrs.Waist;
                double neck = parametrs.Neck; 
                double height = input.HeightCm;

                double logWaistMinusNeck = Math.Log10(waist - neck);
                double logHeight = Math.Log10(height);

                Fat = 495.0 / (1.0324 - 0.19077 * logWaistMinusNeck + 0.15456 * logHeight) - 450.0;
            }
            else 
            {
                
                double waist = parametrs.Waist;
                double hips = (float) parametrs.Hips!;
                double neck = parametrs.Neck;
                double height = input.HeightCm;

                double logWaistPlusHipsMinusNeck = Math.Log10(waist + hips - neck);
                double logHeight = Math.Log10(height);

                Fat = 495.0 / (1.29579 - 0.35004 * logWaistPlusHipsMinusNeck + 0.22100 * logHeight) - 450.0;
            }

            var user = new UserInputDto
            {
                Name = input.Name,
                ChronoAge = input.ChronoAge,
                Sex = input.Sex,
                HeightCm = input.HeightCm,
                Weight = input.Weight,
                Fat = (float) Fat
            };

            return await Calculate(user);

        }

    }
}