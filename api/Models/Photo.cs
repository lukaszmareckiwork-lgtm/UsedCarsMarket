using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Photo
    {
        [Key]
        public int Id { get; set; }

        public int OfferId { get; set; }
        public Offer? Offer { get; set; }

        public string UrlSmall { get; set; } = string.Empty;
        public string UrlMedium { get; set; } = string.Empty;
        public string UrlLarge { get; set; } = string.Empty;

        public int SortOrder { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }

}