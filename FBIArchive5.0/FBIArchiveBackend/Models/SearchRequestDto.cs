namespace FBIArchive.Models
{
    public class SearchRequestDto
    {
        public string Query { get; set; } = string.Empty;
        public string EntityType { get; set; } = "all";
        public string Status { get; set; } = string.Empty;
        public string SecurityLevel { get; set; } = string.Empty;
        public string DocumentType { get; set; } = string.Empty;
        public string Post { get; set; } = string.Empty; 
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}