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

        [HttpPost("calculate")]
        public async Task<ActionResult<CalculationResponse>> CalculateBiologicalAge([FromForm] CalculationRequest request)
        {
            try
            {
               
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (request.IsFemale && !request.Hips.HasValue)
                {
                    ModelState.AddModelError("Hips", "Для женщин обязателен обхват бедер");
                    return BadRequest(ModelState);
                }

             
                var calculation = new BioAgeCalculation
                {
                    Name = request.Name,
                    ChronologicalAge = request.ChronologicalAge,
                    Height = request.Height,
                    Weight = request.Weight,
                    Waist = request.Waist,
                    Neck = request.Neck,
                    Hips = request.Hips,
                    IsFemale = request.IsFemale
                };

                
                var result = _calculationService.Calculate(calculation);

               
                calculation.FatPercentage = result.FatPercentage;
                calculation.BMI = result.BMI;
                calculation.BiologicalAge = result.BiologicalAge;
                calculation.HealthStatus = result.HealthStatus;

              
                var createdCalculation = await _repository.CreateAsync(calculation);

                _logger.LogInformation("Расчет выполнен для пользователя {Name}, биовозраст: {BioAge}",
                    request.Name, result.BiologicalAge);

               
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
    }
}