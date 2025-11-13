// Seller Type
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

// Fuel Type
export const FuelTypeEnum = {
    Petrol : "Petrol",
    Diesel : "Diesel",
    Electric: "Electric",
    Hybrid: "Hybrid",
    Lpg: "Lpg",
    Cng: "Cng"
} as const satisfies Record<string, string>;

export type FuelTypeEnum = (typeof FuelTypeEnum)[keyof typeof FuelTypeEnum];

export function getReadableFuelType (fuelType: FuelTypeEnum): string {
  switch (fuelType) {
    case FuelTypeEnum.Petrol:
      return "Petrol";
    case FuelTypeEnum.Diesel:
      return "Diesel";
    case FuelTypeEnum.Electric:
      return "Electric";
    case FuelTypeEnum.Hybrid:
      return "Hybrid";
    case FuelTypeEnum.Lpg:
      return "LPG";
    case FuelTypeEnum.Cng:
      return "CNG";
    default:
      return "Invalid Fuel Type"
  }
}

// Transmission Type
export const TransmissionTypeEnum = {
    Manual : "Manual",
    Automatic : "Automatic",
    SemiAutomatic: "SemiAutomatic"
} as const satisfies Record<string, string>;

export type TransmissionTypeEnum = (typeof TransmissionTypeEnum)[keyof typeof TransmissionTypeEnum];

export function getReadableTransmissionType (transmissionType: TransmissionTypeEnum): string {
  switch (transmissionType) {
    case TransmissionTypeEnum.Manual:
      return "Manual";
    case TransmissionTypeEnum.Automatic:
      return "Automatic";
    case TransmissionTypeEnum.SemiAutomatic:
      return "Semi-Automatic";
    default:
      return "Invalid Transmission Type"
  }
}

// Currency Type
export const CurrencyTypeEnum = {
  Usd: "Usd",
  Eur: "Eur",
  Pln: "Pln"
} as const satisfies Record<string, string>;

export type CurrencyTypeEnum = (typeof CurrencyTypeEnum)[keyof typeof CurrencyTypeEnum];

export function getReadableCurrencyType(currencyType: CurrencyTypeEnum): string {
  switch (currencyType) {
    case CurrencyTypeEnum.Usd:
      return "USD";
    case CurrencyTypeEnum.Eur:
      return "EUR";
    case CurrencyTypeEnum.Pln:
      return "PLN";
    default:
      return "Invalid Currency Type"
  }
}

// Feature Type
export const FeatureTypeEnum = {
  AirConditioning: "AirConditioning",
  LeatherSeats: "LeatherSeats",
  ParkingSensors: "ParkingSensors",
  CruiseControl: "CruiseControl",
  HeatedSeats: "HeatedSeats",
  Bluetooth: "Bluetooth",
  NavigationSystem: "NavigationSystem",
  BackupCamera: "BackupCamera",
  AlloyWheels: "AlloyWheels",
  Sunroof: "Sunroof",
} as const satisfies Record<string, string>;

export type FeatureTypeEnum = (typeof FeatureTypeEnum)[keyof typeof FeatureTypeEnum];

export function getReadableFeatureType(featureType: FeatureTypeEnum): string {
  switch (featureType) {
    case FeatureTypeEnum.AirConditioning:
      return "Air Conditioning";
    case FeatureTypeEnum.LeatherSeats:
      return "Leather Seats";
    case FeatureTypeEnum.ParkingSensors:
      return "Parking Sensors";
    case FeatureTypeEnum.CruiseControl:
      return "Cruise Control";
    case FeatureTypeEnum.HeatedSeats:
      return "Heated Seats";
    case FeatureTypeEnum.Bluetooth:
      return "Bluetooth";
    case FeatureTypeEnum.NavigationSystem:
      return "Navigation System";
    case FeatureTypeEnum.BackupCamera:
      return "Backup Camera";
    case FeatureTypeEnum.AlloyWheels:
      return "Alloy Wheels";
    case FeatureTypeEnum.Sunroof:
      return "Sunroof";
    default:
      return "Unknown Feature";
  }
}

export interface OfferProps {
  make: string;
  model: string;
  year: number;
  mileage: number;

  fuelType: FuelTypeEnum;
  engineDisplacement?: number;
  enginePower?: number;
  transmission: TransmissionTypeEnum;
  color?: string;
  vin?: string;
  features?: FeatureTypeEnum[];

  title: string;
  subtitle: string;
  description?: string;
  photos?: File[];

  location: string;
  sellerType: SellerTypeEnum;

  price: number;
  currency: CurrencyTypeEnum;

  createdDate: Date;
}