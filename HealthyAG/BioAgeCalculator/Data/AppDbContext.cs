using Microsoft.EntityFrameworkCore;
using BioAgeCalculator.Models;

namespace BioAgeCalculator.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<BioAgeCalculation> BioAgeCalculations { get; set; }
    }
}