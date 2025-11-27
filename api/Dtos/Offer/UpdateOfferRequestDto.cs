using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.Dtos.Offer
{
    public class UpdateOfferRequestDto
    {
        public Guid? Guid { get; set; }

        [Required(ErrorMessage = "MakeId is required.")]
        public int MakeId { get; set; }

        [Required(ErrorMessage = "ModelId is required.")]
        public int ModelId { get; set; }

        [Required(ErrorMessage = "Year is required.")]
        public int Year { get; set; }

        [Required(ErrorMessage = "Mileage is required.")]
        public int Mileage { get; set; }

        [Required(ErrorMessage = "FuelType is required.")]
        public FuelType FuelType { get; set; }

        public int? EngineDisplacement { get; set; }
        public int? EnginePower { get; set; }

        [Required(ErrorMessage = "Transmission type is required.")]
        public TransmissionType Transmission { get; set; }

        public string? Color { get; set; }

        public List<FeatureType>? Features { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(200, ErrorMessage = "Title can contain up to 200 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Subtitle is required.")]
        [MaxLength(200, ErrorMessage = "Subtitle can contain up to 200 characters.")]
        public string Subtitle { get; set; } = string.Empty;

        public string? Description { get; set; }

        public List<byte[]>? Photos { get; set; }

        [Required(ErrorMessage = "Location is required.")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Currency is required.")]
        [MaxLength(3, ErrorMessage = "Currency must be a 3-letter ISO code.")]
        public string Currency { get; set; } = "EUR";

        [Required(ErrorMessage = "CreatedDate is required.")]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
