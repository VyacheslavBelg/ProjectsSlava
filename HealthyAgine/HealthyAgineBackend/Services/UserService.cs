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

 
            float lbm = user.Weight * (1f - user.Fat / 100f);

     
            float persBmr = 370f + 21.6f * lbm;

   
            float refBmr = user.Sex
                ? 10f * user.Weight + 6.25f * user.HeightCm - 5f * user.ChronoAge + 5f
                : 10f * user.Weight + 6.25f * user.HeightCm - 5f * user.ChronoAge - 161f;

    
            float metabolicScore = (persBmr - refBmr) / refBmr * 100f;

   
            float MbAge = user.ChronoAge - (metabolicScore / 5f) * 3f;

            float deltaAge = MbAge - user.ChronoAge;

            string interpretation =
                deltaAge <= -5f ? "Отличное метаболическое здоровье" :
                deltaAge < -1.5f ? "Хорошее метаболическое здоровье" :
                Math.Abs(deltaAge) <= 1.5f ? "Среднее метаболическое здоровье" :
                deltaAge < 5f ? "Неоптимальное метаболическое здоровье" :
                "Плохое метаболическое состояние";

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

            return new UserOutputDto
            {
                MbAge = MbAge,
                DeltaAge = deltaAge,
                Interpretation = interpretation
            };
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

        public async Task<UserOutputDto> CalculateWithPhoto(UserInputDto input, int photo_num)
        {
            float fat;

            if (input.Sex) // мужчина
            {
                fat = photo_num switch
                {
                    1 => 9f,
                    2 => 15f,
                    3 => 22f,
                    4 => 28f,
                    _ => 35f
                };
            }
            else // женщина
            {
                fat = photo_num switch
                {
                    1 => 15f,
                    2 => 22f,
                    3 => 29f,
                    4 => 36f,
                    _ => 45f
                };
            }

            var user = new UserInputDto
            {
                Name = input.Name,
                ChronoAge = input.ChronoAge,
                Sex = input.Sex,
                HeightCm = input.HeightCm,
                Weight = input.Weight,
                Fat = fat
            };

            return await Calculate(user);
        }

    }
}