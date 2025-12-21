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

        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
}