namespace FBIArchive.Models 
{

    public class SearchResultDto
    {
        public List<CaseDto> Cases { get; set; } = new();
        public List<DocumentDto> Documents { get; set; } = new();
        public List<SeriesDto> Series { get; set; } = new();
    }

    public class CaseDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }

    public class DocumentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string SecurityLevel { get; set; } = "";
        public string Type { get; set; } = "";
        public string CaseName { get; set; } = "";
    }

    public class SeriesDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string YearPeriod { get; set; } = "";
    }
}