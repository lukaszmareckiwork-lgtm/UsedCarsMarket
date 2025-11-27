using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Account;
using api.Models;

namespace api.Dtos.Offer
{
    public class OfferPreviewDto
    {
        public int Id { get; set; }
        public Guid? Guid { get; set; }
        
        public SellerDto SellerDto { get; set; } = new SellerDto();

        // Basic info
        public int Year { get; set; }
        public int Mileage { get; set; }
        public FuelType FuelType { get; set; }
        public TransmissionType Transmission { get; set; }

        public decimal? EngineDisplacement { get; set; }
        public int? EnginePower { get; set; }

        // Titles and description
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;

        // Photos can be stored as blob or separate table
        public List<byte[]>? Photos { get; set; }

        public string Location { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public string Currency { get; set; } = "EUR";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}