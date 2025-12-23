using api.Data;
using api.Dtos.Account;
using api.Dtos.Common;
using api.Dtos.Offer;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using api.Service;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class OfferRepostiory : IOfferRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly OfferCountService _offerCountService;

        public OfferRepostiory(ApplicationDBContext context, OfferCountService offerCountService)
        {
            _context = context;
            _offerCountService = offerCountService;
        }

        // Apply common filters to any IQueryable<Offer> so it can be reused by multiple callers
        private IQueryable<Offer> ApplyFilters(IQueryable<Offer> offers, OfferQueryObject query)
        {
            // Filter: Created By User
            if (!string.IsNullOrEmpty(query.CreatedBy))
                offers = offers.Where(o => o.AppUserId == query.CreatedBy);

            // Filter: Search (title, description, make/model names etc. - adjust as needed)
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                string s = query.Search.ToLower();
                offers = offers.Where(o =>
                    o.Title.ToLower().Contains(s) ||
                    o.Description.ToLower().Contains(s)
                );
            }

            // Filter: Models
            if (query.ModelIds != null && query.ModelIds.Any())
                offers = offers.Where(o => query.ModelIds.Contains(o.ModelId));

            // Filter: Makes (only if no models provided)
            else if (query.MakeIds != null && query.MakeIds.Any())
                offers = offers.Where(o => query.MakeIds.Contains(o.MakeId));

            // Filter: Price Range
            if (query.MinPrice.HasValue)
                offers = offers.Where(o => o.Price >= query.MinPrice.Value);

            if (query.MaxPrice.HasValue)
                offers = offers.Where(o => o.Price <= query.MaxPrice.Value);

            // Filter: Year Range
            if (query.MinYear.HasValue)
                offers = offers.Where(o => o.Year >= query.MinYear.Value);

            if (query.MaxYear.HasValue)
                offers = offers.Where(o => o.Year <= query.MaxYear.Value);

            // Filter: Mileage Range
            if (query.MinMileage.HasValue)
                offers = offers.Where(o => o.Mileage >= query.MinMileage.Value);

            if (query.MaxMileage.HasValue)
                offers = offers.Where(o => o.Mileage <= query.MaxMileage.Value);

            // Filter: Fuel Type
            if (query.FuelTypes != null && query.FuelTypes.Any())
                offers = offers.Where(o => query.FuelTypes.Contains(o.FuelType));

            // Filter: Transmission Type
            if (query.TransmissionTypes != null && query.TransmissionTypes.Any())
                offers = offers.Where(o => query.TransmissionTypes.Contains(o.Transmission));

            // Filter: Location Range
            if (query.LocationLat.HasValue &&
                query.LocationLong.HasValue &&
                query.LocationRange.HasValue)
            {
                offers = ApplyApproxDistanceFilter(offers, (double)query.LocationLat, (double)query.LocationLong, (double)query.LocationRange);
            }

            // Sorting
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                switch (query.SortBy)
                {
                    case "createdDate":
                        offers = query.SortDescending
                            ? offers.OrderByDescending(o => o.CreatedDate)
                            : offers.OrderBy(o => o.CreatedDate);
                        break;

                    case "price":
                        offers = query.SortDescending
                            ? offers.OrderByDescending(o => o.Price)
                            : offers.OrderBy(o => o.Price);
                        break;

                    case "year":
                        offers = query.SortDescending
                            ? offers.OrderByDescending(o => o.Year)
                            : offers.OrderBy(o => o.Year);
                        break;

                    case "mileage":
                        offers = query.SortDescending
                            ? offers.OrderByDescending(o => o.Mileage)
                            : offers.OrderBy(o => o.Mileage);
                        break;

                    default:
                        break;
                }
            } 
            else 
            {
                offers = offers.OrderByDescending(o => o.CreatedDate);
            }

            return offers;
        }

        private static IQueryable<Offer> ApplyApproxDistanceFilter(
            IQueryable<Offer> query,
            double userLat,
            double userLng,
            double maxDistanceKm)
        {
            // Convert kilometers to degrees latitude (1° ≈ 111.32 km)
            double latDeg = maxDistanceKm / 111.32;

            // Longitude degrees shrink with latitude (cos(lat))
            double lonDeg = latDeg / Math.Cos(userLat * Math.PI / 180);

            // Square radii
            double latRadSq = latDeg * latDeg;
            double lonRadSq = lonDeg * lonDeg;

            return query.Where(o =>
                ((o.LocationLat  - userLat) * (o.LocationLat  - userLat) <= latRadSq) &&
                ((o.LocationLong - userLng) * (o.LocationLong - userLng) <= lonRadSq)
            );
        }

        public async Task<PagedResult<OfferDto>> GetAllAsync(OfferQueryObject query, string? appUserId = null)
        {
            var offers = ApplyFilters(_context.Offers.AsQueryable(), query);

            var totalCount = await offers.CountAsync(); // count BEFORE pagination

            int pageSize = Math.Clamp(query.PageSize, 1, 50);
            var skip = (query.PageNumber - 1) * pageSize;

            // Project to OfferDto and include IsFavourite as a correlated subquery when appUserId provided
            var items = await offers
                .Skip(skip)
                .Take(pageSize)
                .Select(o => new OfferDto
                {
                    Id = o.Id,
                    Guid = o.Guid,
                    SellerDto = new SellerDto
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

                    IsFavourite = appUserId != null && _context.FavouriteOffers.Any(f => f.AppUserId == appUserId && f.OfferId == o.Id)
                })
                .ToListAsync();

            return new PagedResult<OfferDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<OfferPreviewDto>> GetAllPreviewAsync(OfferQueryObject query, string? appUserId = null)
        {
            var offers = ApplyFilters(_context.Offers.AsQueryable(), query);

            // Count BEFORE pagination
            var totalCount = await offers.CountAsync();

            int pageSize = Math.Clamp(query.PageSize, 1, 50);
            var skip = (query.PageNumber - 1) * pageSize;

            // DTO projection happens inside the query
            var baseQuery = offers
                .Skip(skip)
                .Take(pageSize)
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
                        SellerDto = new SellerDto { SellerType = o.AppUser!.SellerType },
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
                PageSize = pageSize
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
                .AsNoTracking()
                .Where(o => _context.FavouriteOffers.Any(fo => fo.AppUserId == appUserId && fo.OfferId == o.Id));

            var offers = ApplyFilters(baseOffers, query);

            var totalCount = await offers.CountAsync();

            int pageSize = Math.Clamp(query.PageSize, 1, 50);
            var skip = (query.PageNumber - 1) * pageSize;

            var items = await offers
                .Skip(skip)
                .Take(pageSize)
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
                PageSize = pageSize
            };
        }

        public async Task<Offer> CreateAsync(Offer offerModel)
        {
            await _context.Offers.AddAsync(offerModel);
            await _context.SaveChangesAsync();

            // Update counts
            await _offerCountService.IncrementOfferCountAsync(offerModel.MakeId, offerModel.ModelId);

            return offerModel;
        }

        public async Task<Offer?> UpdateModelAsync(Offer offer)
        {
            if (offer == null) return null;

            var oldMakeId = offer.MakeId;
            var oldModelId = offer.ModelId;

            // Attach the offer if not tracked, mark modified so EF will persist changes including Photos
            var tracked = _context.ChangeTracker.Entries<Offer>().FirstOrDefault(e => e.Entity.Id == offer.Id)?.Entity;
            if (tracked == null)
            {
                _context.Offers.Update(offer);
            }

            await _context.SaveChangesAsync();

            // Update counts if Make/Model changed
            await _offerCountService.AdjustOfferCountOnUpdateAsync(oldMakeId, oldModelId, offer.MakeId, offer.ModelId);

            return offer;
        }

        public async Task<Offer?> DeleteAsync(int id)
        {
            var offerModel = await _context.Offers.FirstOrDefaultAsync(o => o.Id == id);

            if(offerModel == null)
                return null;
            
            _context.Offers.Remove(offerModel);
            await _context.SaveChangesAsync();

            // Update counts
            await _offerCountService.DecrementOfferCountAsync(offerModel.MakeId, offerModel.ModelId);

            return offerModel;
        }

        public async Task<bool> OfferExistsAsync(int id)
        {
            return await _context.Offers.AnyAsync(o => o.Id == id);
        }

        public async Task<int> GetUserOffersCount(AppUser user)
        {
            return await _context.Offers.CountAsync(fo => fo.AppUserId == user.Id);
        }
    }
}