using BioAgeCalculator.Models;

namespace BioAgeCalculator.Services
{
    public interface ICalculationService
    {
        CalculationResult Calculate(BioAgeCalculation input);
        CalculationResult CalculateWithFatPercentage(BioAgeCalculation input, double fatPercentage);
    }

    public record CalculationResult(
        double FatPercentage,
        double BMI,
        double BiologicalAge,
        string HealthStatus
    );
}