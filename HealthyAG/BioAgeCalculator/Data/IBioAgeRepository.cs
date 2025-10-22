using BioAgeCalculator.Models;

namespace BioAgeCalculator.Data
{
    public interface IBioAgeRepository
    {
        Task<BioAgeCalculation> CreateAsync(BioAgeCalculation calculation);
    }
}