namespace BioAgeFrontend.Models
{
    public class CalculationRequest
    {
        public string Name { get; set; } = string.Empty;
        public int ChronologicalAge { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }
        public double Waist { get; set; }
        public double Neck { get; set; }
        public double? Hips { get; set; }
        public bool IsFemale { get; set; }

        public bool HasOwnFatPercentage { get; set; }
        public bool UsePhotoEstimation { get; set; }
        public double? FatPercentage { get; set; }
        public string? SelectedPhotoRange { get; set; }
    }
}