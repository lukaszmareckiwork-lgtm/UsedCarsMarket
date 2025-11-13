import React from 'react'
import "./MainSearch.css";
import OffersList from '../OffersList/OffersList';
import CarFilters from '../CarFilters/CarFilters';
import { CurrencyTypeEnum, FeatureTypeEnum, FuelTypeEnum, SellerTypeEnum, TransmissionTypeEnum, type OfferProps } from '../../Data/OfferProps';

const offersData: OfferProps[] = [
  {
    make: "BMW",
    model: "320d",
    year: 2020,
    mileage: 85000,
    fuelType: FuelTypeEnum.Diesel,
    engineDisplacement: 1995,
    enginePower: 190,
    transmission: TransmissionTypeEnum.Automatic,
    color: "Black",
    vin: "WBA8E51060G123456",
    features: [
      FeatureTypeEnum.AirConditioning,
      FeatureTypeEnum.LeatherSeats,
      FeatureTypeEnum.CruiseControl,
      FeatureTypeEnum.NavigationSystem,
      FeatureTypeEnum.HeatedSeats,
    ],
    title: "BMW 320d",
    subtitle: "Sport Line 2020",
    description:
      "BMW 320d Sport Line in excellent condition, full service history, no accidents. Equipped with navigation, leather interior, and heated seats.",
    location: "Kobyłka (Mazowieckie)",
    sellerType: SellerTypeEnum.Private,
    price: 10000,
    currency: CurrencyTypeEnum.Eur,
    createdDate: new Date("2025-10-20T05:17:30"),
  },
  {
    make: "Audi",
    model: "A4",
    year: 2021,
    mileage: 62000,
    fuelType: FuelTypeEnum.Diesel,
    engineDisplacement: 1968,
    enginePower: 204,
    transmission: TransmissionTypeEnum.SemiAutomatic,
    color: "Silver",
    vin: "WAUZZZF47MA012345",
    features: [
      FeatureTypeEnum.ParkingSensors,
      FeatureTypeEnum.BackupCamera,
      FeatureTypeEnum.AlloyWheels,
      FeatureTypeEnum.Bluetooth,
      FeatureTypeEnum.Sunroof,
    ],
    title: "Audi A4",
    subtitle: "2.0 TDI S-Line",
    description:
      "Audi A4 S-Line 2.0 TDI with automatic transmission, well maintained and fully loaded with premium features such as sunroof and parking sensors.",
    location: "Warszawa (Mazowieckie)",
    sellerType: SellerTypeEnum.Institutional,
    price: 15000,
    currency: CurrencyTypeEnum.Usd,
    createdDate: new Date("2025-10-27T10:15:00"),
  },
];

const MainSearch = () => {
    return (
        <div className='main-search'>
            <div className='main-search-grid'>
                <CarFilters />
                <OffersList offers={offersData} />
            </div>
        </div>
    )
}

export default MainSearch