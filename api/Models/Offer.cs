using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace api.Models
{
    // Enums
    public enum SellerType
    {
        Private,
        Institutional
    }

    public enum FuelType
    {
        Petrol,
        Diesel,
        Electric,
        Hybrid,
        Lpg,
        Cng
    }

    public enum TransmissionType
    {
        Manual,
        Automatic,
        SemiAutomatic
    }

    public enum FeatureType
    {
        AirConditioning,
        LeatherSeats,
        ParkingSensors,
        CruiseControl,
        HeatedSeats,
        Bluetooth,
        NavigationSystem,
        BackupCamera,
        AlloyWheels,
        Sunroof
    }

    [Table("Offers")]
    public class Offer
    {
        [Key]
        public int Id { get; set; }

        public Guid? Guid { get; set; }

        public List<FavouriteOffer> FavouriteOffers { get; set; }

        public string? AppUserId { get; set; }
        public AppUser? AppUser { get; set; }

        public int MakeId { get; set; }
        public int ModelId { get; set; }

        public int Year { get; set; }
        public int Mileage { get; set; }
        public FuelType FuelType { get; set; }

        public int? EngineDisplacement { get; set; }
        public int? EnginePower { get; set; }
        public TransmissionType Transmission { get; set; }

        public string? Color { get; set; }
        public string? Vin { get; set; }

        public List<FeatureType>? Features { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string? Description { get; set; }

        public List<byte[]>? Photos { get; set; }

        public string Location { get; set; } = string.Empty;
        public SellerType SellerType { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public string Currency { get; set; } = "EUR";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
