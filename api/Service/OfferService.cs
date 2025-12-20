using api.Dtos.Offer;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Service
{
    public class OfferService
    {
        private readonly IOfferRepository _repo;
        private readonly IBlobStorageService _blob;
        private readonly IImageService _image;
        private readonly UserManager<AppUser> _userManager;

        public OfferService(IOfferRepository repo, IBlobStorageService blob, IImageService image, UserManager<AppUser> userManager)
        {
            _repo = repo;
            _blob = blob;
            _image = image;
            _userManager = userManager;
        }

        public async Task<Offer> CreateOfferAsync(CreateOfferRequestDto dto, IEnumerable<IFormFile>? files = null, string? appUserId = null)
        {
            var offer = new Offer
            {
                Guid = dto.Guid,
                MakeId = dto.MakeId,
                ModelId = dto.ModelId,
                Year = dto.Year,
                Mileage = dto.Mileage,
                FuelType = dto.FuelType,
                EngineDisplacement = dto.EngineDisplacement,
                EnginePower = dto.EnginePower,
                Transmission = dto.Transmission,
                Vin = dto.Vin,
                Color = dto.Color,
                Features = dto.Features,
                Title = dto.Title,
                Subtitle = dto.Subtitle,
                Description = dto.Description,
                LocationName = dto.LocationName,
                LocationLat = dto.LocationLat,
                LocationLong = dto.LocationLong,
                Price = dto.Price,
                Currency = dto.Currency,
                AppUserId = appUserId,
            };

            if (dto.Photos != null && dto.Photos.Any())
            {
                int startOrder = 0;
                foreach (var p in dto.Photos)
                {
                    offer.Photos.Add(new Photo
                    {
                        UrlSmall = p.UrlSmall,
                        UrlMedium = p.UrlMedium,
                        UrlLarge = p.UrlLarge,
                        SortOrder = startOrder++
                    });
                }
            }

            if (files != null)
            {
                int order = offer.Photos.Count;
                foreach (var file in files)
                {
                    var resized = await _image.ResizeToThreeSizesAsync(file);
                    var fileNameBase = Guid.NewGuid().ToString();
                    var urls = await _blob.UploadResizedImagesAsync(resized.Small, resized.Medium, resized.Large, fileNameBase);

                    offer.Photos.Add(new Photo
                    {
                        UrlSmall = urls.Small,
                        UrlMedium = urls.Medium,
                        UrlLarge = urls.Large,
                        SortOrder = order++
                    });
                }
            }

            return await _repo.CreateAsync(offer);
        }

        public async Task<Offer?> UpdateOfferAsync(int id, UpdateOfferRequestDto dto, IEnumerable<int>? photoIdsToKeep = null, IEnumerable<IFormFile>? newFiles = null)
        {
            var offer = await _repo.GetByIdAsync(id);
            if (offer == null) return null;

            offer.Guid = dto.Guid;
            offer.MakeId = dto.MakeId;
            offer.ModelId = dto.ModelId;
            offer.Year = dto.Year;
            offer.Mileage = dto.Mileage;
            offer.FuelType = dto.FuelType;
            offer.EngineDisplacement = dto.EngineDisplacement;
            offer.EnginePower = dto.EnginePower;
            offer.Transmission = dto.Transmission;
            offer.Color = dto.Color;
            offer.Features = dto.Features;
            offer.Title = dto.Title;
            offer.Subtitle = dto.Subtitle;
            offer.Description = dto.Description;
            offer.LocationName = dto.LocationName;
            offer.LocationLat = dto.LocationLat;
            offer.LocationLong = dto.LocationLong;
            offer.Price = dto.Price;
            offer.Currency = dto.Currency;

            // If DTO contains photo metadata (ids and desired sort orders), use it
            if (dto.Photos != null && dto.Photos.Any())
            {
                var idsToKeep = dto.Photos.Where(p => p.Id > 0).Select(p => p.Id).ToHashSet();

                // Delete photos that are not present in DTO
                var toDelete = offer.Photos.Where(p => !idsToKeep.Contains(p.Id)).ToList();
                foreach (var photo in toDelete)
                {
                    if (!string.IsNullOrWhiteSpace(photo.UrlSmall)) await _blob.DeleteAsync(photo.UrlSmall);
                    if (!string.IsNullOrWhiteSpace(photo.UrlMedium)) await _blob.DeleteAsync(photo.UrlMedium);
                    if (!string.IsNullOrWhiteSpace(photo.UrlLarge)) await _blob.DeleteAsync(photo.UrlLarge);

                    offer.Photos.Remove(photo);
                }

                // Update sort order of kept photos according to DTO
                foreach (var dtoPhoto in dto.Photos.Where(p => p.Id > 0))
                {
                    var existing = offer.Photos.FirstOrDefault(p => p.Id == dtoPhoto.Id);
                    if (existing != null)
                    {
                        existing.SortOrder = dtoPhoto.SortOrder;
                    }
                }
            }
            else if (photoIdsToKeep != null)
            {
                var toDelete = offer.Photos.Where(p => !photoIdsToKeep.Contains(p.Id)).ToList();
                foreach (var photo in toDelete)
                {
                    if (!string.IsNullOrWhiteSpace(photo.UrlSmall)) await _blob.DeleteAsync(photo.UrlSmall);
                    if (!string.IsNullOrWhiteSpace(photo.UrlMedium)) await _blob.DeleteAsync(photo.UrlMedium);
                    if (!string.IsNullOrWhiteSpace(photo.UrlLarge)) await _blob.DeleteAsync(photo.UrlLarge);

                    offer.Photos.Remove(photo);
                }
            }

            if (newFiles != null)
            {
                int order = offer.Photos.Any() ? offer.Photos.Max(p => p.SortOrder) + 1 : 0;
                foreach (var file in newFiles)
                {
                    var resized = await _image.ResizeToThreeSizesAsync(file);
                    var fileNameBase = Guid.NewGuid().ToString();
                    var urls = await _blob.UploadResizedImagesAsync(resized.Small, resized.Medium, resized.Large, fileNameBase);

                    offer.Photos.Add(new Photo
                    {
                        UrlSmall = urls.Small,
                        UrlMedium = urls.Medium,
                        UrlLarge = urls.Large,
                        SortOrder = order++
                    });
                }
            }

            // Normalize sort order to be continuous (0..N-1) after any changes.
            var normalized = offer.Photos
                .OrderBy(p => p.SortOrder)
                .ThenBy(p => p.Id)
                .ToList();

            for (int i = 0; i < normalized.Count; i++)
            {
                normalized[i].SortOrder = i;
            }

            return await _repo.UpdateModelAsync(offer);
        }

        public async Task<Offer?> DeleteOfferAsync(int id, AppUser appUser)
        {
            var isAdmin = await _userManager.IsInRoleAsync(appUser, "Admin");
            
            var offer = await _repo.GetByIdAsync(id);
            if (offer == null) return null;

            if(!isAdmin && offer.AppUserId != appUser.Id)
                throw new UnauthorizedAccessException("User is not allowed to delete this offer.");

            foreach (var photo in offer.Photos)
            {
                if (!string.IsNullOrWhiteSpace(photo.UrlSmall)) await _blob.DeleteAsync(photo.UrlSmall);
                if (!string.IsNullOrWhiteSpace(photo.UrlMedium)) await _blob.DeleteAsync(photo.UrlMedium);
                if (!string.IsNullOrWhiteSpace(photo.UrlLarge)) await _blob.DeleteAsync(photo.UrlLarge);
            }

            return await _repo.DeleteAsync(id);
        }
    }
}