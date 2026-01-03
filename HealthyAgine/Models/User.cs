namespace HealthyAgine.Models
{
    public class User
    {
        public string? Name { get; set; }
        public int ChronoAge { get; set; }
        public bool Sex { get; set; }
        public int HeightCm { get; set; }
        public int Weight { get; set; }
        public float Fat { get; set; }
    }

    public class UserInputDto
    {
        public string? Name { get; set; }
        public int ChronoAge { get; set; }
        public bool Sex { get; set; }
        public int HeightCm { get; set; }
        public int Weight { get; set; }
        public float Fat { get; set; }
    }

    public class UserOutputDto
    {
        public float MbAge { get; set; } 
        public float DeltaAge {  get; set; }
        public string? Interpretation { get; set; }
    }

    public class UserDBSave
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Sex { get; set; }
        public float Fat { get; set; }
        public int ChronoAge { get; set; }
        public float MbAge { get; set; }
        public float deltaAge { get; set; }
    }

}