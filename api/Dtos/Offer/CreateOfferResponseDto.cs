namespace api.Dtos.Offer
{

    public class CreateOfferResponseDto
    {
        public OfferDto OfferDto { get; set; } = default!;
        public int UserOffersCount { get; set; }
    }
}