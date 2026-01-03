namespace FBIArchive.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Badge { get; set; } = "";
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public DateTime BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string Post { get; set; } = "";
        public string? PhotoUrl { get; set; }

        
        public int InvestigationDepartmentId { get; set; }
        public InvestigationDepartment InvestigationDepartment { get; set; } = null!;

        public ICollection<Case> Cases { get; set; } = new List<Case>();
    }
}