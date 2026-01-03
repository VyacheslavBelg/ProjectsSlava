namespace FBIArchive.Models
{
    public class Document
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime CreateDate { get; set; }
        public string SecurityLevel { get; set; } = "";
        public string DocumentType { get; set; } = "";

        public int SeriesId { get; set; }
        public int CaseId { get; set; }

        public Series Series { get; set; } = null!;
        public Case Case { get; set; } = null!;
    }
}
