using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace api.Models
{
    [Table("OfferCounts")]
    public class OfferCount
    {
        [Key]
        public int Id { get; set; }

        public int MakeId { get; set; }
        public int? ModelId { get; set; } // null for make-level counts

        public int OffersCount { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}