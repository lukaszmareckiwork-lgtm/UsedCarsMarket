using api.Models;

namespace api.Interfaces
{
    public interface IFavouriteOffersRepository
    {
        Task<List<Offer>> GetUserFavouriteOffers(AppUser user);
        Task<FavouriteOffer> CreateAsync(FavouriteOffer favouriteOffer);
        Task<FavouriteOffer?> DeleteAsync(AppUser user, int offerId);
    }
}