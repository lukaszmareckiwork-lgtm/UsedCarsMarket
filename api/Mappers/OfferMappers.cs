using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Offer;
using api.Models;

namespace api.Mappers
{
    public static class OfferMappers
    {
        public static OfferDto OfferDto(this Offer offer)
        {
            return new OfferDto()
            {
                Id = offer.Id,
                Guid = offer.Guid,

                MakeId = offer.MakeId,
                ModelId = offer.ModelId,

                Year = offer.Year,
                Mileage = offer.Mileage,
                
                FuelType = offer.FuelType,
                EngineDisplacement = offer.EngineDisplacement,
                EnginePower = offer.EnginePower,
                Transmission = offer.Transmission,

                Color = offer.Color,

                Features = offer.Features,

                Title = offer.Title,
                Subtitle = offer.Subtitle,
                Description = offer.Description,

                Photos = offer.Photos,

                Location = offer.Location,

                SellerType = offer.SellerType,

                Price = offer.Price,
                Currency = offer.Currency,

                CreatedDate = offer.CreatedDate
            };
        }

        public static OfferPreviewDto OfferPreviewDto(this Offer offer)
        {
            return new OfferPreviewDto()
            {
                Id = offer.Id,
                Guid = offer.Guid,

                Year = offer.Year,
                Mileage = offer.Mileage,
                
                FuelType = offer.FuelType,
                Transmission = offer.Transmission,

                Title = offer.Title,
                Subtitle = offer.Subtitle,

                Photos = offer.Photos,

                Location = offer.Location,

                SellerType = offer.SellerType,

                Price = offer.Price,
                Currency = offer.Currency,

                CreatedDate = offer.CreatedDate
            };
        }

        public static Offer ToOfferFromCreateDto(this CreateOfferRequestDto requestDto)
        {
            return new Offer()
            {
                Guid = requestDto.Guid,

                MakeId = requestDto.MakeId,
                ModelId = requestDto.ModelId,

                Year = requestDto.Year,
                Mileage = requestDto.Mileage,
                
                FuelType = requestDto.FuelType,
                EngineDisplacement = requestDto.EngineDisplacement,
                EnginePower = requestDto.EnginePower,
                Transmission = requestDto.Transmission,

                Color = requestDto.Color,

                Features = requestDto.Features,

                Title = requestDto.Title,
                Subtitle = requestDto.Subtitle,

                Photos = requestDto.Photos,

                Location = requestDto.Location,

                SellerType = requestDto.SellerType,

                Price = requestDto.Price,
                Currency = requestDto.Currency,

                CreatedDate = requestDto.CreatedDate
            };
        }
    }
}