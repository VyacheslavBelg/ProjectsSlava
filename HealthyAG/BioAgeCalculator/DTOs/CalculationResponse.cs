namespace BioAgeCalculator.DTOs
{
    public class CalculationResponse
    {
        public string Name { get; set; } = string.Empty;
        public int ChronologicalAge { get; set; }
        public double FatPercentage { get; set; }
        public double BMI { get; set; }
        public double BiologicalAge { get; set; }
        public string HealthStatus { get; set; } = string.Empty;
        public double AgeDifference { get; set; }
        public DateTime CalculatedAt { get; set; }
    }
}