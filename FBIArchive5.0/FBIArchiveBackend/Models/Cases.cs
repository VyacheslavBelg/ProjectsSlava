namespace FBIArchive.Models
{
    public class Case
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public DateTime OpenDate { get; set; }
        public DateTime? CloseDate { get; set; }
        public string Description { get; set; } = "";
        public string Status { get; set; } = "";

        public int? DefendantId { get; set; }
        public int? EmployeeId { get; set; }

        
        public Defendant? Defendant { get; set; } = null!;
        public Employee? Employee { get; set; } = null!;

        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
}