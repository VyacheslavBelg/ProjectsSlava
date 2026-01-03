using System.ComponentModel.DataAnnotations;

namespace BioAgeCalculator.DTOs
{
    public class CalculationRequest
    {
        [Required(ErrorMessage = "Имя обязательно")]
        [StringLength(100, ErrorMessage = "Имя не должно превышать 100 символов")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Возраст обязателен")]
        [Range(1, 120, ErrorMessage = "Возраст должен быть от 1 до 120 лет")]
        public int ChronologicalAge { get; set; }

        [Required(ErrorMessage = "Рост обязателен")]
        [Range(50, 250, ErrorMessage = "Рост должен быть от 50 до 250 см")]
        public double Height { get; set; }

        [Required(ErrorMessage = "Вес обязателен")]
        [Range(20, 300, ErrorMessage = "Вес должен быть от 20 до 300 кг")]
        public double Weight { get; set; }

        public double? Waist { get; set; }
        public double? Neck { get; set; }
        public double? Hips { get; set; }

        public bool IsFemale { get; set; }

        public bool HasOwnFatPercentage { get; set; }
        public bool UsePhotoEstimation { get; set; }

        [Range(1, 70, ErrorMessage = "Процент жира должен быть от 1 до 70")]
        public double? FatPercentage { get; set; }
        public string? SelectedPhotoRange { get; set; }
    }
}
