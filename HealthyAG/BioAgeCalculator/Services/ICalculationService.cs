using BioAgeCalculator.Models;

namespace BioAgeCalculator.Services
{
    public interface ICalculationService
    {
        CalculationResult Calculate(BioAgeCalculation input);
    }

    public record CalculationResult(
        double FatPercentage,
        double BMI,
        double BiologicalAge,
        string HealthStatus
    );
}