using BioAgeCalculator.Models;

namespace BioAgeCalculator.Services
{
    public class CalculationService : ICalculationService
    {
        private const double IDEAL_BMI = 22.0;
        private const double FEMALE_FAT_COEFFICIENT = 0.6;
        private const double MALE_FAT_COEFFICIENT = 0.7;
        private const double BMI_COEFFICIENT = 0.4;
        private const double METABOLIC_COEFFICIENT = 0.3;
        private const double AGE_COEFFICIENT_FACTOR = 0.02;

        public CalculationResult Calculate(BioAgeCalculation input)
        {
            ValidateInput(input);

            var fatPercentage = CalculateFatPercentage(input);
            var bmi = CalculateBMI(input.Height, input.Weight);
            var biologicalAge = CalculateBiologicalAge(input.ChronologicalAge, input.Height,
                input.Weight, fatPercentage, input.IsFemale);
            var healthStatus = GetHealthStatus(input.ChronologicalAge, biologicalAge);

            return new CalculationResult(fatPercentage, bmi, biologicalAge, healthStatus);
        }

        private void ValidateInput(BioAgeCalculation input)
        {
            if (input == null)
                throw new ArgumentNullException(nameof(input));

            if (input.ChronologicalAge < 18 || input.ChronologicalAge > 100)
                throw new ArgumentException("Возраст должен быть от 18 до 100 лет");

            if (input.Height <= 100 || input.Height > 250)
                throw new ArgumentException("Рост должен быть от 100 до 250 см");

            if (input.Weight <= 20 || input.Weight > 300)
                throw new ArgumentException("Вес должен быть от 20 до 300 кг");

            if (input.Waist <= 30 || input.Waist > 200)
                throw new ArgumentException("Обхват талии должен быть от 30 до 200 см");

            if (input.Neck <= 20 || input.Neck > 60)
                throw new ArgumentException("Обхват шеи должен быть от 20 до 60 см");

            if (input.IsFemale)
            {
                if (!input.Hips.HasValue)
                    throw new ArgumentException("Для женщин обязателен обхват бедер");

                if (input.Hips.Value <= 50 || input.Hips.Value > 200)
                    throw new ArgumentException("Обхват бедер должен быть от 50 до 200 см");
            }
            else
            {
                if (input.Waist <= input.Neck)
                    throw new ArgumentException("Обхват талии должен быть больше обхвата шеи");
            }
        }

        private double CalculateFatPercentage(BioAgeCalculation input)
        {
            double fatPercentage;

            if (input.IsFemale)
            {
                if (!input.Hips.HasValue)
                    throw new ArgumentException("Для женщин обязателен обхват бедер");

                double hipsValue = input.Hips.Value;

                
                fatPercentage = 495 / (1.29579 - 0.35004 * Math.Log10(input.Waist + hipsValue - input.Neck)
                             + 0.22100 * Math.Log10(input.Height)) - 450;
            }
            else
            {
                
                fatPercentage = 495 / (1.0324 - 0.19077 * Math.Log10(input.Waist - input.Neck)
                             + 0.15456 * Math.Log10(input.Height)) - 450;
            }

           
            return Math.Round(Math.Max(5, Math.Min(50, fatPercentage)), 1);
        }

        private double CalculateBMI(double height, double weight)
        {
            var heightMeters = height / 100;
            return Math.Round(weight / (heightMeters * heightMeters), 1);
        }

        private double CalculateBiologicalAge(int chronologicalAge, double height, double weight,
                                            double fatPercentage, bool isFemale)
        {
            var heightMeters = height / 100;
            var actualBMI = weight / (heightMeters * heightMeters);
            var normalFat = GetNormalFat(chronologicalAge, isFemale);

            
            var k_fat = 0.3;
            var k_bmi = 0.2;
            var k_metabolic = 0.1;

            var ageCoefficient = 1 + Math.Max(0, chronologicalAge - 25) * 0.01;

            var deltaFat = Math.Max(0, fatPercentage - normalFat) * k_fat * ageCoefficient;
            var deltaBMI = Math.Max(0, Math.Abs(actualBMI - 22) - 2) * k_bmi;
            var deltaMetabolic = Math.Max(0, (actualBMI / 22 - 1)) * k_metabolic * chronologicalAge;

            var biologicalAge = chronologicalAge + deltaFat + deltaBMI + deltaMetabolic;

            
            return Math.Round(Math.Max(chronologicalAge - 10, Math.Min(chronologicalAge + 20, biologicalAge)), 1);
        }

        private double GetNormalFat(int age, bool isFemale)
        {
            if (isFemale)
            {
                return age <= 25 ? 23 :
                       age <= 35 ? 25 :
                       age <= 45 ? 28 :
                       age <= 55 ? 31 : 33;
            }
            else
            {
                return age <= 25 ? 16 :
                       age <= 35 ? 18 :
                       age <= 45 ? 20 :
                       age <= 55 ? 22 : 24;
            }
        }

        private string GetHealthStatus(int chronologicalAge, double biologicalAge)
        {
            var difference = biologicalAge - chronologicalAge;

            return difference <= -3 ? "Вы моложе своих лет!" :
                   difference >= -2 && difference <= 2 ? "Соответствуете возрасту!" :
                   difference >= 3 && difference <= 7 ? "Есть над чем работать!" :
                   "Серьезный повод заняться здоровьем!";
        }
    }
}