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

        [Required(ErrorMessage = "Обхват талии обязателен")]
        [Range(30, 200, ErrorMessage = "Обхват талии должен быть от 30 до 200 см")]
        public double Waist { get; set; }

        [Required(ErrorMessage = "Обхват шеи обязателен")]
        [Range(20, 60, ErrorMessage = "Обхват шеи должен быть от 20 до 60 см")]
        public double Neck { get; set; }

        [Range(50, 200, ErrorMessage = "Обхват бедер должен быть от 50 до 200 см")]
        public double? Hips { get; set; }

        public bool IsFemale { get; set; }
    }
}