using api.Data;
using api.Dtos.Offer;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class OfferRepostiory : IOfferRepository
    {
        private readonly ApplicationDBContext _context;

        public OfferRepostiory(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Offer>> GetAllAsync(OfferQueryObject query)
        {
            var offers = _context.Offers.AsQueryable();

            if (!string.IsNullOrEmpty(query.CreatedBy))
                offers = offers.Where(o => o.AppUserId == query.CreatedBy);

            // If models selected → filter by models
            if (query.ModelIds != null && query.ModelIds.Any())
            {
                offers = offers.Where(o => query.ModelIds.Contains(o.ModelId));
            }
            // Else if makes selected → filter by makes
            else if (query.MakeIds != null && query.MakeIds.Any())
            {
                offers = offers.Where(o => query.MakeIds.Contains(o.MakeId));
            }

            // Sort By
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if(query.SortBy.Equals("Price", StringComparison.OrdinalIgnoreCase))
                {
                    offers = query.SortDescending ? offers.OrderByDescending(x => x.Price) : offers.OrderBy(x => x.Price);
                }
            }

            var skipNumber = (query.PageNumber - 1) * query.PageSize;

            return await offers.Include(o => o.AppUser).Skip(skipNumber).Take(query.PageSize).ToListAsync();
        }

        public async Task<List<OfferPreviewDto>> GetAllPreviewAsync(OfferQueryObject query)
        {
            var offers = _context.Offers.AsQueryable();

            // Filter by CreatedBy
            if (!string.IsNullOrEmpty(query.CreatedBy))
                offers = offers.Where(o => o.AppUserId == query.CreatedBy);

            // Filter by models
            if (query.ModelIds != null && query.ModelIds.Any())
            {
                offers = offers.Where(o => query.ModelIds.Contains(o.ModelId));
            }
            // Filter by makes
            else if (query.MakeIds != null && query.MakeIds.Any())
            {
                offers = offers.Where(o => query.MakeIds.Contains(o.MakeId));
            }

            // Sorting
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if (query.SortBy.Equals("Price", StringComparison.OrdinalIgnoreCase))
                {
                    offers = query.SortDescending
                        ? offers.OrderByDescending(o => o.Price)
                        : offers.OrderBy(o => o.Price);
                }
            }

            var skipNumber = (query.PageNumber - 1) * query.PageSize;

            // Dto projection in "Select" to save db resources
            return await offers
                .Skip(skipNumber)
                .Take(query.PageSize)
                .Select(o => new OfferPreviewDto
                {
                    Id = o.Id,
                    Guid = o.Guid,
                    CreatedBy = o.AppUserId,

                    Year = o.Year,
                    Mileage = o.Mileage,
                    FuelType = o.FuelType,
                    Transmission = o.Transmission,

                    Title = o.Title,
                    Subtitle = o.Subtitle,

                    Photos = null,

                    Location = o.Location,

                    SellerType = o.SellerType,

                    Price = o.Price,
                    Currency = o.Currency,

                    CreatedDate = o.CreatedDate
                })
                .ToListAsync();
        }

        public async Task<Offer?> GetByIdAsync(int id)
        {
            return await _context.Offers.Include(o => o.AppUser).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Offer> CreateAsync(Offer offerModel)
        {
            await _context.Offers.AddAsync(offerModel);
            await _context.SaveChangesAsync();
            return offerModel;
        }

        public async Task<Offer?> UpdateAsync(int id, UpdateOfferRequestDto updateOfferRequestDto)
        {
            var offerModel = await _context.Offers.FirstOrDefaultAsync(o => o.Id == id);

            if(offerModel == null)
                return null;
         
            offerModel.Guid = updateOfferRequestDto.Guid;
            offerModel.MakeId = updateOfferRequestDto.MakeId;
            offerModel.ModelId = updateOfferRequestDto.ModelId;
            //ADD EVRYTHING THAT WE WANT TO UPDATE
            offerModel.Description = updateOfferRequestDto.Description;

            await _context.SaveChangesAsync();
            return offerModel;
        }

        public async Task<Offer?> DeleteAsync(int id)
        {
            var offerModel = await _context.Offers.FirstOrDefaultAsync(o => o.Id == id);

            if(offerModel == null)
                return null;
            
            _context.Offers.Remove(offerModel);
            await _context.SaveChangesAsync();
            return offerModel;
        }

        public async Task<bool> OfferExistsAsync(int id)
        {
            return await _context.Offers.AnyAsync(o => o.Id == id);
        }
    }
}