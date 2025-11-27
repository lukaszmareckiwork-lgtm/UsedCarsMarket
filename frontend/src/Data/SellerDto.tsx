import type { SellerTypeEnum } from "./OfferProps";

export interface SellerDto {
    userId: string,
    username: string,
    email: string,
    phoneNumber: string,
    sellerType: SellerTypeEnum
}