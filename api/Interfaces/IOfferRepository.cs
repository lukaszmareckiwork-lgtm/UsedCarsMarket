using api.Dtos.Offer;
using api.Helpers;
using api.Models;

namespace api.Interfaces
{
    public interface IOfferRepository
    {
        Task<List<Offer>> GetAllAsync(OfferQueryObject query);
        Task<List<OfferPreviewDto>> GetAllPreviewAsync(OfferQueryObject query);
        Task<Offer?> GetByIdAsync(int id);
        Task<Offer> CreateAsync(Offer offer);
        Task<Offer?> UpdateAsync(int id, UpdateOfferRequestDto offerRequestDto);
        Task<Offer?> DeleteAsync(int id);
        Task<bool> OfferExistsAsync(int id);
    }
}