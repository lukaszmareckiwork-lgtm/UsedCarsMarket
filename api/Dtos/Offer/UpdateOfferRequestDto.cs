using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Dtos.Offer
{
    public class UpdateOfferRequestDto
    {
        public Guid? Guid { get; set; }

        // Foreign keys
        public int MakeId { get; set; }
        public int ModelId { get; set; }

        // Basic info
        public int Year { get; set; }
        public int Mileage { get; set; }

        public FuelType FuelType { get; set; }
        public int? EngineDisplacement { get; set; }
        public int? EnginePower { get; set; }
        public TransmissionType Transmission { get; set; }

        public string? Color { get; set; }

        // Features list
        public List<FeatureType>? Features { get; set; }

        // Titles and description
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Photos can be stored as blob or separate table
        public List<byte[]>? Photos { get; set; }

        public string Location { get; set; } = string.Empty;

        public SellerType SellerType { get; set; }

        public decimal Price { get; set; }
        public string Currency { get; set; } = "EUR";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}