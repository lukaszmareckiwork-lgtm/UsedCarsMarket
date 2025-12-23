using api.Data;
using api.Dtos.OfferCount;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class OfferCountRepository : IOfferCountRepository
    {
        private readonly ApplicationDBContext _context;

        public OfferCountRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<MakeOfferCountDto>> GetMakeCountsAsync()
        {
            return await _context.OfferCounts
                .Where(oc => oc.ModelId == null)
                .Join(
                    _context.Makes,
                    oc => oc.MakeId,
                    m => m.MakeId,
                    (oc, m) => new MakeOfferCountDto
                    {
                        MakeId = oc.MakeId,
                        MakeName = m.MakeName,
                        MakeSlug = m.MakeSlug,
                        OfferCount = oc.OffersCount
                    })
                .OrderByDescending(x => x.OfferCount)
                .ToListAsync();
        }

        public async Task<List<ModelOfferCountDto>> GetModelCountsAsync(List<int> makeIds)
        {
            return await _context.OfferCounts
                .Where(x => x.ModelId != null && makeIds.Contains(x.MakeId))
                .Select(x => new ModelOfferCountDto
                {
                    MakeId = x.MakeId,
                    ModelId = x.ModelId!.Value,
                    ModelName = _context.Models
                        .Where(m => m.ModelId == x.ModelId)
                        .Select(m => m.ModelName)
                        .FirstOrDefault() ?? string.Empty,
                    OfferCount = x.OffersCount
                })
                .OrderByDescending(x => x.OfferCount)
                .ToListAsync();
        }

        public async Task UpdateOfferCountAsync(int makeId, int? modelId, int delta)
        {
            var count = await _context.OfferCounts
                .FirstOrDefaultAsync(x => x.MakeId == makeId && x.ModelId == modelId);

            if (count != null)
            {
                count.OffersCount += delta;
                count.LastUpdated = DateTime.UtcNow;
            }
            else
            {
                count = new OfferCount
                {
                    MakeId = makeId,
                    ModelId = modelId,
                    OffersCount = Math.Max(delta, 0),
                    LastUpdated = DateTime.UtcNow
                };
                _context.OfferCounts.Add(count);
            }

            await _context.SaveChangesAsync();
        }
    }
}
