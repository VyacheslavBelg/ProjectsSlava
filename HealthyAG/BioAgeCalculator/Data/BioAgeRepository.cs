using Microsoft.EntityFrameworkCore;
using BioAgeCalculator.Models;

namespace BioAgeCalculator.Data
{
    public class BioAgeRepository : IBioAgeRepository
    {
        private readonly AppDbContext _context;

        public BioAgeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<BioAgeCalculation> CreateAsync(BioAgeCalculation calculation)
        {
            _context.BioAgeCalculations.Add(calculation);
            await _context.SaveChangesAsync();
            return calculation;
        }
    }
}