export const SellerTypeEnum = {
    Private : "Private",
    Institutional : "Institutional"
} as const satisfies Record<string, string>;

export type SellerTypeEnum = (typeof SellerTypeEnum)[keyof typeof SellerTypeEnum];

export function getReadableSellerType (sellerType: SellerTypeEnum): string {
  switch (sellerType) {
    case SellerTypeEnum.Private:
      return "Private seller";
    case SellerTypeEnum.Institutional:
      return "Institutional seller";
    default:
      return "Unknown seller";
  }
}

export interface OfferProps {
  title: string;
  subtitle: string;
  location: string;
  sellerType: SellerTypeEnum;
  createdDate: Date;
  price: number;
  currency: string;
}