export interface CreateOfferRequestDto {
  makeId: number;
  modelId: number;
  year: number;
  mileage: number;
  fuelType: number;
  engineDisplacement: number;
  enginePower: number;
  transmission: number;
  color?: string;
  vin?: string;
  features?: number[];
  title: string;
  subtitle: string;
  description?: string;
  location: string;
  price: number;
  currency: string;

  photosFiles?: File[];
}
