using api.Dtos.MakesAndModels;
using api.Interfaces;
using api.Models;

namespace api.Service
{

    public class MakesService
    {
        private readonly IMakesRepository _makesRepo;
        private readonly IOfferCountRepository _offerCountRepo;

        public MakesService(
            IMakesRepository makesRepo,
            IOfferCountRepository offerCountRepo)
        {
            _makesRepo = makesRepo;
            _offerCountRepo = offerCountRepo;
        }

        public async Task<List<MakeWithOffersDto>> GetMakesAsync()
        {
            var makes = await _makesRepo.GetAllAsync();
            var counts = await _offerCountRepo.GetMakeCountsAsync();

            var countLookup = counts.ToDictionary(x => x.MakeId, x => x.OfferCount);

            return makes.Select(m => new MakeWithOffersDto
            {
                MakeId = m.MakeId,
                MakeName = m.MakeName,
                MakeSlug = m.MakeSlug,
                OffersCount = countLookup.GetValueOrDefault(m.MakeId)
            }).ToList();
        }

        public async Task<List<MakeModelsWithOffersDto>> GetModelsByMakeIdsAsync(List<int> makeIds)
        {
            var models = await _makesRepo.GetModelsAsync(makeIds);
            var counts = await _offerCountRepo.GetModelCountsAsync(makeIds);

            var countLookup = counts.ToDictionary(x => x.ModelId, x => x.OfferCount);

            return models.Select(m => new MakeModelsWithOffersDto
            {
                MakeId = m.MakeId,
                Models = m.Models.Select(md => new ModelWithOffersDto
                {
                    ModelId = md.ModelId,
                    ModelName = md.ModelName,
                    OffersCount = countLookup.GetValueOrDefault(md.ModelId)
                }).ToList()
            }).ToList();
        }
    }
}