using api.Dtos.OfferCount;
using api.Interfaces;

namespace api.Service
{
    public class OfferCountService
    {
        private readonly IOfferCountRepository _repo;

        public OfferCountService(IOfferCountRepository repo)
        {
            _repo = repo;
        }

        public Task<List<MakeOfferCountDto>> GetMakeCountsAsync() => _repo.GetMakeCountsAsync();

        public Task<List<ModelOfferCountDto>> GetModelCountsAsync(List<int> makeIds) => _repo.GetModelCountsAsync(makeIds);

#region Offer Count updates

        // Call this after creating a new offer
        public async Task IncrementOfferCountAsync(int makeId, int modelId)
        {
            await _repo.UpdateOfferCountAsync(makeId, null, 1);          // Increment make-level count
            await _repo.UpdateOfferCountAsync(makeId, modelId, 1);       // Increment model-level count
        }

        // Call this after deleting an offer
        public async Task DecrementOfferCountAsync(int makeId, int modelId)
        {
            await _repo.UpdateOfferCountAsync(makeId, null, -1);         // Decrement make-level count
            await _repo.UpdateOfferCountAsync(makeId, modelId, -1);      // Decrement model-level count
        }

        // Call this after updating an offer where MakeId or ModelId may change
        public async Task AdjustOfferCountOnUpdateAsync(int oldMakeId, int oldModelId, int newMakeId, int newModelId)
        {
            if (oldMakeId == newMakeId && oldModelId == newModelId)
                return; // nothing changed

            // Decrement old counts
            await DecrementOfferCountAsync(oldMakeId, oldModelId);

            // Increment new counts
            await IncrementOfferCountAsync(newMakeId, newModelId);
        }
        
#endregion
    }
}
