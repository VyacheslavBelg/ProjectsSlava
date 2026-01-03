namespace FBIArchive.Models
{
    public class Series
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string YearPeriod { get; set; } = "";

        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
}
