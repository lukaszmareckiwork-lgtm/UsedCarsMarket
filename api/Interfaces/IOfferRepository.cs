using api.Dtos.Common;
using api.Dtos.Offer;
using api.Helpers;
using api.Models;

namespace api.Interfaces
{
    public interface IOfferRepository
    {
        Task<PagedResult<OfferDto>> GetAllAsync(OfferQueryObject query, string? appUserId = null);
        Task<PagedResult<OfferPreviewDto>> GetAllPreviewAsync(OfferQueryObject query, string? appUserId = null);
        Task<PagedResult<OfferPreviewDto>> GetAllPreviewFavouritesAsync(string appUserId, OfferQueryObject query);
        Task<Offer?> GetByIdAsync(int id);
        Task<Offer> CreateAsync(Offer offer);
        Task<Offer?> UpdateModelAsync(Offer offer);
        Task<Offer?> DeleteAsync(int id);
        Task<bool> OfferExistsAsync(int id);
    }
}