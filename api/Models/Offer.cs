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

    // [ValidateNever]
    public class Offer
    {
        // Primary key: integer for performance
        [Key]
        public int Id { get; set; }

        // Optional GUID for client-side or distributed ID usage
        public Guid? Guid { get; set; }

        // Foreign keys
        public int MakeId { get; set; }
        public int ModelId { get; set; }

        // Basic info
        [Required]
        public int Year { get; set; }

        [Required]
        public int Mileage { get; set; }

        [Required]
        public FuelType FuelType { get; set; }

        public int? EngineDisplacement { get; set; }
        public int? EnginePower { get; set; }

        [Required]
        public TransmissionType Transmission { get; set; }

        public string? Color { get; set; }
        public string? Vin { get; set; }

        // Features list
        public List<FeatureType>? Features { get; set; }

        // Titles and description
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        public string Subtitle { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Photos can be stored as blob or separate table
        public List<byte[]>? Photos { get; set; }

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public SellerType SellerType { get; set; }

        [Required, Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required, MaxLength(3)]
        public string Currency { get; set; } = "EUR";

        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
