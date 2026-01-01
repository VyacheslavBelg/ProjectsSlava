namespace FBIArchive.Models
{
    public class Defendant
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string Alias { get; set; } = "";
        public DateTime BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string Status { get; set; } = "";
        public string? PhotoUrl { get; set; }

        
        public int OrganizationId { get; set; }
        public Organization Organization { get; set; } = null!;

        public ICollection<Case> Cases { get; set; } = new List<Case>();
    }
}