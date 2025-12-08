export interface OfferQueryObject {
  OnlyFavourites?: boolean;
  CreatedBy?: string | null;

  MakeIds?: number[] | null;
  ModelIds?: number[] | null;

  Search?: string | null;

  MinPrice?: number | null;
  MaxPrice?: number | null;

  MinYear?: number | null;
  MaxYear?: number | null;

  MinMileage?: number | null;
  MaxMileage?: number | null;

  FuelType?: number | null;
  TransmissionType?: number | null;

  LocationLat?: number | null;
  LocationLong?: number | null;
  LocationRange?: number | null;

  SortBy?: string | null;
  SortDescending?: boolean;

  PageNumber: number;
  PageSize: number;
}