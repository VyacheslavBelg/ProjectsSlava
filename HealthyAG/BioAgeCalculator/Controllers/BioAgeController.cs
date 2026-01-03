using Microsoft.AspNetCore.Mvc;
using BioAgeCalculator.Data;
using BioAgeCalculator.Models;
using BioAgeCalculator.Services;
using BioAgeCalculator.DTOs;

namespace BioAgeCalculator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BioAgeController : ControllerBase
    {
        private readonly IBioAgeRepository _repository;
        private readonly ICalculationService _calculationService;
        private readonly ILogger<BioAgeController> _logger;

        public BioAgeController(
            IBioAgeRepository repository,
            ICalculationService calculationService,
            ILogger<BioAgeController> logger)
        {
            _repository = repository;
            _calculationService = calculationService;
            _logger = logger;
        }

       
        [HttpGet("photo-ranges/{isFemale}")]
        public ActionResult<PhotoFatRangesResponse> GetPhotoRanges(bool isFemale)
        {
            var ranges = isFemale ? GetFemaleRanges() : GetMaleRanges();
            return Ok(new PhotoFatRangesResponse { Ranges = ranges });
        }

        private List<PhotoFatRange> GetMaleRanges()
        {
            return new List<PhotoFatRange>
    {
        new PhotoFatRange
        {
            Range = "5-9",
            DisplayName = "5-9% (Очень низкий)",
            MinFat = 5,
            MaxFat = 9,
            ImageUrl = "/images/male/fat-range-5-9.jpg",
            Description = "Атлетическое телосложение, рельефные мышцы"
        },
        new PhotoFatRange
        {
            Range = "10-19",
            DisplayName = "10-19% (Низкий/Нормальный)",
            MinFat = 10,
            MaxFat = 19,
            ImageUrl = "/images/male/fat-range-10-19.jpg",
            Description = "Спортивное телосложение, хороший тонус"
        },
        new PhotoFatRange
        {
            Range = "20-29",
            DisplayName = "20-29% (Средний)",
            MinFat = 20,
            MaxFat = 29,
            ImageUrl = "/images/male/fat-range-20-29.jpg",
            Description = "Нормальное телосложение, умеренный жир"
        },
        new PhotoFatRange
        {
            Range = "30-39",
            DisplayName = "30-39% (Выше среднего)",
            MinFat = 30,
            MaxFat = 39,
            ImageUrl = "/images/male/fat-range-30-39.jpg",
            Description = "Повышенное содержание жира"
        },
        new PhotoFatRange
        {
            Range = "40-plus",
            DisplayName = "40%+ (Высокий)",
            MinFat = 40,
            MaxFat = 60,
            ImageUrl = "/images/male/fat-range-40-plus.jpg",
            Description = "Высокое содержание жира"
        }
    };
        }

        private List<PhotoFatRange> GetFemaleRanges()
        {
            return new List<PhotoFatRange>
    {
        new PhotoFatRange
        {
            Range = "15-19",
            DisplayName = "15-19% (Очень низкий)",
            MinFat = 15,
            MaxFat = 19,
            ImageUrl = "/images/female/fat-range-15-19.jpg",
            Description = "Атлетическое телосложение, рельефные мышцы"
        },
        new PhotoFatRange
        {
            Range = "20-29",
            DisplayName = "20-29% (Низкий/Нормальный)",
            MinFat = 20,
            MaxFat = 29,
            ImageUrl = "/images/female/fat-range-20-29.jpg",
            Description = "Спортивное телосложение, хороший тонус"
        },
        new PhotoFatRange
        {
            Range = "30-39",
            DisplayName = "30-39% (Средний)",
            MinFat = 30,
            MaxFat = 39,
            ImageUrl = "/images/female/fat-range-30-39.jpg",
            Description = "Нормальное телосложение, умеренный жир"
        },
        new PhotoFatRange
        {
            Range = "40-49",
            DisplayName = "40-49% (Выше среднего)",
            MinFat = 40,
            MaxFat = 49,
            ImageUrl = "/images/female/fat-range-40-49.jpg",
            Description = "Повышенное содержание жира"
        },
        new PhotoFatRange
        {
            Range = "50-plus",
            DisplayName = "50%+ (Высокий)",
            MinFat = 50,
            MaxFat = 70,
            ImageUrl = "/images/female/fat-range-50-plus.jpg",
            Description = "Высокое содержание жира"
        }
    };
        }

        [HttpPost("calculate")]
        public async Task<ActionResult<CalculationResponse>> CalculateBiologicalAge([FromForm] CalculationRequest request)
        {
            try
            {

                _logger.LogInformation($"Расчет для: {request.Name}, Пол: {(request.IsFemale ? "Женский" : "Мужской")}, " +
                              $"Способ: {(request.UsePhotoEstimation ? "Фото" : "Замеры")}, " +
                              $"Выбранный диапазон: {request.SelectedPhotoRange}");


              
                var validationResult = ValidateInputMethod(request);
                if (!validationResult.IsValid)
                {
                    return BadRequest(validationResult.ErrorMessage);
                }

               
                if (request.Height <= 0 || request.Weight <= 0 || request.ChronologicalAge <= 0)
                {
                    return BadRequest("Рост, вес и возраст должны быть положительными числами.");
                }

                var calculation = new BioAgeCalculation
                {
                    Name = request.Name,
                    ChronologicalAge = request.ChronologicalAge,
                    Height = request.Height,
                    Weight = request.Weight,
                    Waist = request.Waist ?? 0,
                    Neck = request.Neck ?? 0,
                    Hips = request.Hips ?? 0,
                    IsFemale = request.IsFemale
                };

                CalculationResult result;
                double finalFatPercentage;

             
                if (request.UsePhotoEstimation && !string.IsNullOrEmpty(request.SelectedPhotoRange))
                {
                    
                    finalFatPercentage = GetFatPercentageFromPhotoRange(request.SelectedPhotoRange, request.IsFemale);

                    _logger.LogInformation($"Расчет по фото: диапазон={request.SelectedPhotoRange}, " +
                                  $"пол={(request.IsFemale ? "женский" : "мужской")}, " +
                                  $"процент жира={finalFatPercentage}");

                    calculation.FatPercentage = finalFatPercentage;
                    result = _calculationService.CalculateWithFatPercentage(calculation, finalFatPercentage);
                }
                else if (request.HasOwnFatPercentage && request.FatPercentage.HasValue)
                {
                   
                    finalFatPercentage = request.FatPercentage.Value;
                    calculation.FatPercentage = finalFatPercentage;
                    result = _calculationService.CalculateWithFatPercentage(calculation, finalFatPercentage);
                }
                else
                {
                 
                    result = _calculationService.Calculate(calculation);
                    finalFatPercentage = result.FatPercentage;
                    calculation.FatPercentage = finalFatPercentage;
                }

                calculation.BMI = result.BMI;
                calculation.BiologicalAge = result.BiologicalAge;
                calculation.HealthStatus = result.HealthStatus;

                var createdCalculation = await _repository.CreateAsync(calculation);

                return Ok(new CalculationResponse
                {
                    Name = createdCalculation.Name,
                    ChronologicalAge = createdCalculation.ChronologicalAge,
                    FatPercentage = createdCalculation.FatPercentage,
                    BMI = createdCalculation.BMI,
                    BiologicalAge = createdCalculation.BiologicalAge,
                    HealthStatus = createdCalculation.HealthStatus,
                    AgeDifference = Math.Round(createdCalculation.BiologicalAge - createdCalculation.ChronologicalAge, 1),
                    CalculatedAt = createdCalculation.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при расчете биовозраста для {Name}", request.Name);
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
        }

       
        private (bool IsValid, string ErrorMessage) ValidateInputMethod(CalculationRequest request)
        {
            int methodCount = 0;

            if (!request.HasOwnFatPercentage && !request.UsePhotoEstimation)
                methodCount++; 

            if (request.HasOwnFatPercentage)
                methodCount++;

            if (request.UsePhotoEstimation)
                methodCount++;

            if (methodCount == 0)
                return (false, "Выберите способ определения процента жира: замеры тела, прямой ввод или оценка по фото.");

            if (methodCount > 1)
                return (false, "Выберите только один способ определения процента жира.");

            if (request.UsePhotoEstimation && string.IsNullOrEmpty(request.SelectedPhotoRange))
                return (false, "Выберите диапазон процента жира по фото.");

            return (true, string.Empty);
        }

        private double GetFatPercentageFromPhotoRange(string range, bool isFemale)
        {
            if (isFemale)
            {
                return range switch
                {
                    "15-19" => 17.0,   
                    "20-29" => 24.5,
                    "30-39" => 34.5,
                    "40-49" => 44.5,
                    "50-plus" => 55.0,
                    _ => 30.0
                };
            }
            else
            {
                return range switch
                {
                    "5-9" => 7.0,    
                    "10-19" => 14.5,
                    "20-29" => 24.5,
                    "30-39" => 34.5,
                    "40-plus" => 45.0,
                    _ => 20.0 
                };
            }
        }
    }
}
