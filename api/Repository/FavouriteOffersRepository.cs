using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class FavouriteOffersRepository : IFavouriteOffersRepository
    {
        private readonly ApplicationDBContext _context;

        public FavouriteOffersRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Offer>> GetUserFavouriteOffers(AppUser user)
        {
            return await _context.FavouriteOffers.Where(fo => fo.AppUserId == user.Id)
            .Select(offer => offer.Offer)
            .ToListAsync();
        }
    }
}