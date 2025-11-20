using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    [Table("FavouriteOffers")]
    public class FavouriteOffer
    {
        public string AppUserId { get; set; }
        public int OfferId { get; set; }
        public AppUser AppUser { get; set; }
        public Offer Offer { get; set; }
    }
}