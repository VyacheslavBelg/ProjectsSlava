using System.ComponentModel.DataAnnotations;

namespace BioAgeCalculator.Models
{
    public class BioAgeCalculation
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(1, 120)]
        public int ChronologicalAge { get; set; }

        [Range(50, 250)]
        public double Height { get; set; }

        [Range(20, 300)]
        public double Weight { get; set; }

        [Range(30, 200)]
        public double Waist { get; set; }

        [Range(20, 60)]
        public double Neck { get; set; }

        [Range(50, 200)]
        public double? Hips { get; set; }

        public bool IsFemale { get; set; }

        public double FatPercentage { get; set; }
        public double BMI { get; set; }
        public double BiologicalAge { get; set; }
        public string HealthStatus { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}