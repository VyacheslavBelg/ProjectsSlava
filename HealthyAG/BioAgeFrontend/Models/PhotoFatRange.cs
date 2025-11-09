namespace BioAgeFrontend.Models
{
    public class PhotoFatRange
    {
        public string Range { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public double MinFat { get; set; }
        public double MaxFat { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class PhotoFatRangesResponse
    {
        public List<PhotoFatRange> Ranges { get; set; } = new();
    }
}