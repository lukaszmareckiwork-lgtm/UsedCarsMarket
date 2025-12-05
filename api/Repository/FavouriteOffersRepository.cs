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

        public async Task<FavouriteOffer> CreateAsync(FavouriteOffer favouriteOffer)
        {
            var favOffer = await _context.FavouriteOffers.AddAsync(favouriteOffer);
            await _context.SaveChangesAsync();
            return favOffer.Entity;
        }

        public async Task<FavouriteOffer?> DeleteAsync(AppUser user, int offerId)
        {
            var favOfferModel = await _context.FavouriteOffers.FirstOrDefaultAsync(fo => fo.AppUserId == user.Id && fo.OfferId == offerId);

            if(favOfferModel == null)
                return null;

            _context.FavouriteOffers.Remove(favOfferModel);
            await _context.SaveChangesAsync();
            return favOfferModel;
        }

        public async Task<List<int>> GetUserFavouriteOffersIds(AppUser user)
        {
            return await _context.FavouriteOffers.Where(fo => fo.AppUserId == user.Id)
                .Select(offer => offer.OfferId)
                .ToListAsync();
        }

        public async Task<int> GetUserFavouriteOffersCount(AppUser user)
        {
            return await _context.FavouriteOffers.CountAsync(fo => fo.AppUserId == user.Id);
        }

        public async Task<bool> ExistsAsync(string appUserId, int offerId)
        {
            return await _context.FavouriteOffers.AnyAsync(fo => fo.AppUserId == appUserId && fo.OfferId == offerId);
        }
    }
}