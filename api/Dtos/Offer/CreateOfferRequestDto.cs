using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.Dtos.Offer
{
    public class CreateOfferRequestDto
    {
        public Guid? Guid { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "MakeId must be a valid identifier.")]
        public int MakeId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ModelId must be a valid identifier.")]
        public int ModelId { get; set; }

        [Required]
        [Range(1886, 2100, ErrorMessage = "Year must be between 1886 and 2100.")]
        public int Year { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Mileage cannot be negative.")]
        public int Mileage { get; set; }

        [Required]
        public FuelType FuelType { get; set; }

        [Range(0.1, 20.0, ErrorMessage = "Engine displacement must be realistic.")]
        public decimal? EngineDisplacement { get; set; }

        [Range(0, 3000, ErrorMessage = "Engine power must be realistic.")]
        public int? EnginePower { get; set; }

        [Required]
        public TransmissionType Transmission { get; set; }

        [StringLength(17, MinimumLength = 17, ErrorMessage = "VIN must be exactly 17 characters.")]
        [RegularExpression("^[A-HJ-NPR-Z0-9]{17}$", ErrorMessage = "VIN format is invalid.")]
        public string? Vin { get; set; }

        [MaxLength(50)]
        public string? Color { get; set; }

        public List<FeatureType>? Features { get; set; }

        [Required]
        [MaxLength(60)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(80)]
        public string? Subtitle { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        public List<PhotoDto> Photos { get; set; } = new();

        [Required]
        [MaxLength(200)]
        public string LocationName { get; set; } = string.Empty;

        [Required]
        [Range(-90, 90)]
        public double LocationLat { get; set; }

        [Required]
        [Range(-180, 180)]
        public double LocationLong { get; set; }

        [Required]
        [Range(1, 1_000_000_000)]
        public decimal Price { get; set; }

        [Required]
        [RegularExpression("^[A-Z]{3}$", ErrorMessage = "Currency must be a 3-letter ISO code.")]
        public string Currency { get; set; } = "EUR";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}