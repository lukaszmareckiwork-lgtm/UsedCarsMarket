using api.Dtos.OfferCount;

namespace api.Interfaces
{
    public interface IOfferCountRepository
    {
        Task<List<MakeOfferCountDto>> GetMakeCountsAsync();
        Task<List<ModelOfferCountDto>> GetModelCountsAsync(List<int> makeIds);
        Task UpdateOfferCountAsync(int makeId, int? modelId, int delta);
    }
}
