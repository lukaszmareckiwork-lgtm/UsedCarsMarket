// ===============================
// Seller Type

import type { PhotoDto } from "./PhotoDto";
import type { SellerDto } from "./SellerDto";

// ===============================
export const SellerTypeEnum = {
  Private: 0,
  Institutional: 1,
} as const;
export type SellerTypeEnum = number;

export function getReadableSellerType(sellerType: SellerTypeEnum): string {
  switch (sellerType) {
    case SellerTypeEnum.Private: return "Private Seller";
    case SellerTypeEnum.Institutional: return "Institutional Seller";
    default: return "Unknown";
  }
}

// ===============================
// Fuel Type
// ===============================
export const FuelTypeEnum = {
  Petrol: 0,
  Diesel: 1,
  Electric: 2,
  Hybrid: 3,
  Lpg: 4,
  Cng: 5,
} as const;
export type FuelTypeEnum = number;

export function getReadableFuelType(fuelType: FuelTypeEnum): string {
  switch (fuelType) {
    case FuelTypeEnum.Petrol: return "Petrol";
    case FuelTypeEnum.Diesel: return "Diesel";
    case FuelTypeEnum.Electric: return "Electric";
    case FuelTypeEnum.Hybrid: return "Hybrid";
    case FuelTypeEnum.Lpg: return "LPG";
    case FuelTypeEnum.Cng: return "CNG";
    default: return "Invalid Fuel";
  }
}

// ===============================
// Transmission Type
// ===============================
export const TransmissionTypeEnum = {
  Manual: 0,
  Automatic: 1,
  SemiAutomatic: 2,
} as const;
export type TransmissionTypeEnum = number;

export function getReadableTransmissionType(transmissionType: TransmissionTypeEnum): string {
  switch (transmissionType) {
    case TransmissionTypeEnum.Manual: return "Manual";
    case TransmissionTypeEnum.Automatic: return "Automatic";
    case TransmissionTypeEnum.SemiAutomatic: return "Semi-Automatic";
    default: return "Invalid Transmission";
  }
}

// ===============================
// Currency Type
// ===============================
export const CurrencyTypeEnum = {
  Usd: "Usd",
  Eur: "Eur",
  Pln: "Pln",
} as const;

export type CurrencyTypeEnum = (typeof CurrencyTypeEnum)[keyof typeof CurrencyTypeEnum];


export function getReadableCurrencyType(currencyType: CurrencyTypeEnum): string {
  switch (currencyType) {
    case "Usd": return "USD";
    case "Eur": return "EUR";
    case "Pln": return "PLN";
    default: return "Invalid Currency";
  }
}

// ===============================
// Feature Type
// ===============================
export const FeatureTypeEnum = {
  AirConditioning: 0,
  LeatherSeats: 1,
  ParkingSensors: 2,
  CruiseControl: 3,
  HeatedSeats: 4,
  Bluetooth: 5,
  NavigationSystem: 6,
  BackupCamera: 7,
  AlloyWheels: 8,
  Sunroof: 9,
} as const;
export type FeatureTypeEnum = number;

export function getReadableFeatureType(featureType: FeatureTypeEnum): string {
  switch (featureType) {
    case FeatureTypeEnum.AirConditioning: return "Air Conditioning";
    case FeatureTypeEnum.LeatherSeats: return "Leather Seats";
    case FeatureTypeEnum.ParkingSensors: return "Parking Sensors";
    case FeatureTypeEnum.CruiseControl: return "Cruise Control";
    case FeatureTypeEnum.HeatedSeats: return "Heated Seats";
    case FeatureTypeEnum.Bluetooth: return "Bluetooth";
    case FeatureTypeEnum.NavigationSystem: return "Navigation System";
    case FeatureTypeEnum.BackupCamera: return "Backup Camera";
    case FeatureTypeEnum.AlloyWheels: return "Alloy Wheels";
    case FeatureTypeEnum.Sunroof: return "Sunroof";
    default: return "Unknown Feature";
  }
}

// ===============================
// Offer Props Interface
// ===============================
export interface OfferProps {
  id: number;

  makeId: number;
  modelId: number;
  year: number;
  mileage: number;

  sellerDto: SellerDto;

  fuelType: FuelTypeEnum;
  engineDisplacement: number;
  enginePower: number;
  transmission: TransmissionTypeEnum;
  color?: string;
  vin?: string;
  features?: FeatureTypeEnum[];

  title: string;
  subtitle: string;
  description?: string;
  photos?: PhotoDto[];

  location: string;

  price: number;
  currency: CurrencyTypeEnum;

  createdDate: Date | string;
}
