using api.Models;

namespace api.Interfaces
{
    public interface IFavouriteOffersRepository
    {
        Task<List<int>> GetUserFavouriteOffersIds(AppUser user);
        Task<int> GetUserFavouriteOffersCount(AppUser user);
        Task<FavouriteOffer> CreateAsync(FavouriteOffer favouriteOffer);
        Task<FavouriteOffer?> DeleteAsync(AppUser user, int offerId);
        Task<bool> ExistsAsync(string appUserId, int offerId);
    }
}