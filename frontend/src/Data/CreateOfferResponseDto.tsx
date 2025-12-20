import type { OfferProps } from "./OfferProps";

export interface CreateOfferResponseDto {
  offerDto: OfferProps;
  userOffersCount: number;
}
