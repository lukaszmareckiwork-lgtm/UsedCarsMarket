

namespace api.Dtos.Offer
{
    public class PhotoDto
    {
        public int Id { get; set; }
        public string UrlSmall { get; set; } = string.Empty;
        public string UrlMedium { get; set; } = string.Empty;
        public string UrlLarge { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
