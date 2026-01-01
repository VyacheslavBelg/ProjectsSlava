namespace FBIArchive.Models
{
    public class Organization
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string OrganizationType { get; set; } = "";
        public DateTime? EstablishedDate { get; set; }
        public DateTime? DisbandedDate { get; set; }
        public string Status { get; set; } = "";

        public ICollection<Defendant> Defendants { get; set; } = new List<Defendant>();
    }
}