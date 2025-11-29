using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class AppUser : IdentityUser
    {
        public SellerType SellerType { get; set; } = SellerType.Private;
        public List<FavouriteOffer> FavouriteOffers { get; set; } = new();
    }
}