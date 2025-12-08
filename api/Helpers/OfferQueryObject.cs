using api.Models;

namespace api.Helpers
{
    public class OfferQueryObject
    {
        public string? CreatedBy { get; set; }
        public List<int>? MakeIds { get; set; } = null;
        public List<int>? ModelIds { get; set; } = null;
        public string? Search { get; set; } = null;
        public int? MinPrice { get; set; } = null;
        public int? MaxPrice { get; set; } = null;
        public int? MinYear { get; set; } = null;
        public int? MaxYear { get; set; } = null;
        public int? MinMileage { get; set; } = null;
        public int? MaxMileage { get; set; } = null;
        public FuelType? FuelType { get; set; } = null;
        public TransmissionType? TransmissionType { get; set; } = null;
        public double? LocationLat { get; set; } = null;
        public double? LocationLong { get; set; } = null;
        public double? LocationRange { get; set; } = null;
        public string? SortBy { get; set; } = null;
        public bool SortDescending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}