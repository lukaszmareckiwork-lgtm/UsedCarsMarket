using api.Data;
using api.Dtos.Account;
using api.Dtos.Common;
using api.Dtos.Offer;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
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

        // Apply common filters to any IQueryable<Offer> so it can be reused by multiple callers
        private IQueryable<Offer> ApplyFilters(IQueryable<Offer> offers, OfferQueryObject query)
        {
            // get only created by user
            if (!string.IsNullOrEmpty(query.CreatedBy))
                offers = offers.Where(o => o.AppUserId == query.CreatedBy);

            // If models selected → filter by models
            if (query.ModelIds != null && query.ModelIds.Any())
                offers = offers.Where(o => query.ModelIds.Contains(o.ModelId));
            else if (query.MakeIds != null && query.MakeIds.Any())
                offers = offers.Where(o => query.MakeIds.Contains(o.MakeId));

            // Sort By
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if (query.SortBy.Equals("Price", StringComparison.OrdinalIgnoreCase))
                    offers = query.SortDescending
                        ? offers.OrderByDescending(x => x.Price)
                        : offers.OrderBy(x => x.Price);
            }

            return offers;
        }

        public async Task<PagedResult<OfferDto>> GetAllAsync(OfferQueryObject query, string? appUserId = null)
        {
            var offers = ApplyFilters(_context.Offers.AsQueryable(), query);

            var totalCount = await offers.CountAsync(); // count BEFORE pagination

            var skip = (query.PageNumber - 1) * query.PageSize;

            // Project to OfferDto and include IsFavourite as a correlated subquery when appUserId provided
            var items = await offers
                .Skip(skip)
                .Take(query.PageSize)
                .Select(o => new OfferDto
                {
                    Id = o.Id,
                    Guid = o.Guid,
                    SellerDto = new api.Dtos.Account.SellerDto
                    {
                        UserId = o.AppUser != null ? o.AppUser.Id : string.Empty,
                        Username = o.AppUser != null ? (o.AppUser.UserName ?? string.Empty) : string.Empty,
                        PhoneNumber = o.AppUser != null ? (o.AppUser.PhoneNumber ?? string.Empty) : string.Empty,
                        Email = o.AppUser != null ? (o.AppUser.Email ?? string.Empty) : string.Empty,
                        SellerType = o.AppUser != null ? o.AppUser.SellerType : api.Models.SellerType.Private
                    },
                    MakeId = o.MakeId,
                    ModelId = o.ModelId,
                    Year = o.Year,
                    Mileage = o.Mileage,
                    FuelType = o.FuelType,
                    EngineDisplacement = o.EngineDisplacement,
                    EnginePower = o.EnginePower,
                    Transmission = o.Transmission,
                    Color = o.Color,
                    Vin = o.Vin,
                    Features = o.Features,
                    Title = o.Title,
                    Subtitle = o.Subtitle,
                    Description = o.Description,
                    Photos = o.Photos.Select(p => new PhotoDto
                    {
                        Id = p.Id,
                        UrlSmall = p.UrlSmall,
                        UrlMedium = p.UrlMedium,
                        UrlLarge = p.UrlLarge,
                        SortOrder = p.SortOrder,
                        CreatedDate = p.CreatedDate
                    }).ToList(),
                    LocationName = o.LocationName,
                    LocationLat = o.LocationLat,
                    LocationLong = o.LocationLong,
                    Price = o.Price,
                    Currency = o.Currency,
                    CreatedDate = o.CreatedDate,
                    // correlated subquery for IsFavourite
                    // EF will translate Any(...) into EXISTS(...) in SQL
                    // set to false if no user provided
                    // Note: this expression must be translatable by EF
                    IsFavourite = appUserId != null && _context.FavouriteOffers.Any(f => f.AppUserId == appUserId && f.OfferId == o.Id)
                })
                .ToListAsync();

            return new PagedResult<OfferDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<PagedResult<OfferPreviewDto>> GetAllPreviewAsync(OfferQueryObject query, string? appUserId = null)
        {
            var offers = ApplyFilters(_context.Offers.AsQueryable(), query);

            // Count BEFORE pagination
            var totalCount = await offers.CountAsync();

            var skip = (query.PageNumber - 1) * query.PageSize;

            // DTO projection happens inside the query
            var baseQuery = offers
                .Skip(skip)
                .Take(query.PageSize)
                .Include(o => o.Photos);

            List<OfferPreviewDto> items;

            if (string.IsNullOrEmpty(appUserId))
            {
                items = await baseQuery
                    .Select(OfferMappers.ProjToOfferPreviewDto)
                    .ToListAsync();
            }
            else
            {
                items = await baseQuery
                    .Select(o => new OfferPreviewDto
                    {
                        Id = o.Id,
                        Guid = o.Guid,
                        SellerDto = new api.Dtos.Account.SellerDto { SellerType = o.AppUser!.SellerType },
                        Year = o.Year,
                        Mileage = o.Mileage,
                        FuelType = o.FuelType,
                        Transmission = o.Transmission,
                        EngineDisplacement = o.EngineDisplacement,
                        EnginePower = o.EnginePower,
                        Title = o.Title,
                        Subtitle = o.Subtitle,
                        Photos = o.Photos.Select(p => new PhotoDto {
                            Id = p.Id,
                            UrlSmall = p.UrlSmall,
                            UrlMedium = p.UrlMedium,
                            UrlLarge = p.UrlLarge,
                            SortOrder = p.SortOrder,
                            CreatedDate = p.CreatedDate
                        }).ToList(),
                        LocationName = o.LocationName,
                        LocationLat = o.LocationLat,
                        LocationLong = o.LocationLong,
                        Price = o.Price,
                        Currency = o.Currency,
                        CreatedDate = o.CreatedDate,
                        IsFavourite = _context.FavouriteOffers.Any(f => f.AppUserId == appUserId && f.OfferId == o.Id)
                    })
                    .ToListAsync();
            }

            return new PagedResult<OfferPreviewDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<Offer?> GetByIdAsync(int id)
        {
            return await _context.Offers
                .Include(o => o.AppUser)
                .Include(o => o.Photos)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        // Get favourite offers for a user with the same filtering/ paging/ projection as GetAllPreviewAsync
        public async Task<PagedResult<OfferPreviewDto>> GetAllPreviewFavouritesAsync(string appUserId, OfferQueryObject query)
        {
            // Start from the Offers root but restrict to offers present in the user's favourites.
            var baseOffers = _context.Offers
                .Where(o => _context.FavouriteOffers.Any(fo => fo.AppUserId == appUserId && fo.OfferId == o.Id));

            var offers = ApplyFilters(baseOffers, query);

            var totalCount = await offers.CountAsync();

            var skip = (query.PageNumber - 1) * query.PageSize;

            var items = await offers
                .Skip(skip)
                .Take(query.PageSize)
                .Include(o => o.Photos)
                .Select(OfferMappers.ProjToOfferPreviewDto)
                .ToListAsync();

            // mark returned previews as favourited since they come from the FavouriteOffers join
            foreach (var it in items)
                it.IsFavourite = true;

            return new PagedResult<OfferPreviewDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<Offer> CreateAsync(Offer offerModel)
        {
            await _context.Offers.AddAsync(offerModel);
            await _context.SaveChangesAsync();
            return offerModel;
        }

        public async Task<Offer?> UpdateModelAsync(Offer offer)
        {
            if (offer == null) return null;

            // Attach the offer if not tracked, mark modified so EF will persist changes including Photos
            var tracked = _context.ChangeTracker.Entries<Offer>().FirstOrDefault(e => e.Entity.Id == offer.Id)?.Entity;
            if (tracked == null)
            {
                _context.Offers.Update(offer);
            }

            await _context.SaveChangesAsync();
            return offer;
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