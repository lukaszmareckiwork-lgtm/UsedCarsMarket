using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Dtos.Account;
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
                
                SellerDto = new SellerDto
                {
                    UserId = offer.AppUser?.Id ?? "",
                    Username = offer.AppUser?.UserName ?? "",
                    PhoneNumber = offer.AppUser?.PhoneNumber ?? "",
                    Email = offer.AppUser?.Email ?? "",
                    SellerType = offer.AppUser?.SellerType ?? SellerType.Private,
                },

                MakeId = offer.MakeId,
                ModelId = offer.ModelId,

                Year = offer.Year,
                Mileage = offer.Mileage,
                
                FuelType = offer.FuelType,
                EngineDisplacement = offer.EngineDisplacement,
                EnginePower = offer.EnginePower,
                Transmission = offer.Transmission,

                Color = offer.Color,
                Vin = offer.Vin,

                Features = offer.Features,

                Title = offer.Title,
                Subtitle = offer.Subtitle,
                Description = offer.Description,

                Photos = offer.Photos,

                Location = offer.Location,

                Price = offer.Price,
                Currency = offer.Currency,

                CreatedDate = offer.CreatedDate
            };
        }

        // public static OfferPreviewDto OfferPreviewDto(this Offer offer)
        // {
        //     return new OfferPreviewDto()
        //     {
        //         Id = offer.Id,
        //         Guid = offer.Guid,

        //         SellerDto = new SellerDto
        //         {
        //             // UserId = offer.AppUser?.Id ?? "",
        //             // Username = offer.AppUser?.UserName ?? "",
        //             // PhoneNumber = offer.AppUser?.PhoneNumber ?? "",
        //             // Email = offer.AppUser?.Email ?? "",
        //             SellerType = offer.AppUser?.SellerType ?? SellerType.Private,
        //         },

        //         Year = offer.Year,
        //         Mileage = offer.Mileage,
                
        //         FuelType = offer.FuelType,
        //         Transmission = offer.Transmission,
        //         EngineDisplacement = offer.EngineDisplacement,
        //         EnginePower = offer.EnginePower,

        //         Title = offer.Title,
        //         Subtitle = offer.Subtitle,

        //         Photos = offer.Photos,

        //         Location = offer.Location,

        //         Price = offer.Price,
        //         Currency = offer.Currency,

        //         CreatedDate = offer.CreatedDate
        //     };
        // }

        /// <summary>
        /// Projection instead of mapper method for use in LINQ queries
        /// </summary>
        public static readonly Expression<Func<Offer, OfferPreviewDto>> ProjToOfferPreviewDto =
        o => new OfferPreviewDto
        {
            Id = o.Id,
            Guid = o.Guid,
            SellerDto = new SellerDto
            {
                SellerType = o.AppUser!.SellerType
            },
            Year = o.Year,
            Mileage = o.Mileage,
            FuelType = o.FuelType,
            Transmission = o.Transmission,
            EngineDisplacement = o.EngineDisplacement,
            EnginePower = o.EnginePower,
            Title = o.Title,
            Subtitle = o.Subtitle,
            Photos = null,
            Location = o.Location,
            Price = o.Price,
            Currency = o.Currency,
            CreatedDate = o.CreatedDate
        };

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

                Vin = requestDto.Vin,
                Color = requestDto.Color,

                Features = requestDto.Features,

                Title = requestDto.Title,
                Subtitle = requestDto.Subtitle,
                Description = requestDto.Description,

                Photos = requestDto.Photos,

                Location = requestDto.Location,

                Price = requestDto.Price,
                Currency = requestDto.Currency,

                // CreatedDate = requestDto.CreatedDate
            };
        }
    }
}