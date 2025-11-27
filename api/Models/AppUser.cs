using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class AppUser : IdentityUser
    {
        public SellerType SellerType { get; set; } = SellerType.Private;
        public List<FavouriteOffer> FavouriteOffers { get; set; } = [];
    }
}