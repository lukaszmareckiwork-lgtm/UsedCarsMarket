import { useState } from 'react'
import "./MainSearch.css";
import OffersList from '../OffersList/OffersList';
import { type OfferProps } from '../../Data/OfferProps';
import OffersFilters from '../OffersFilters/OffersFilters';
import type { PagedResult } from '../../Helpers/PagedResult';
import ReactPaginate from 'react-paginate';

// const offersData: OfferProps[] = [
//   {
//     offerId: "test_0",

//     makeId: 452,//BMW
//     modelId: 2172,//320i
//     year: 2020,
//     mileage: 85000,
//     fuelType: FuelTypeEnum.Diesel,
//     engineDisplacement: 1995,
//     enginePower: 190,
//     transmission: TransmissionTypeEnum.Automatic,
//     color: "Black",
//     vin: "WBA8E51060G123456",
//     features: [
//       FeatureTypeEnum.AirConditioning,
//       FeatureTypeEnum.LeatherSeats,
//       FeatureTypeEnum.CruiseControl,
//       FeatureTypeEnum.NavigationSystem,
//       FeatureTypeEnum.HeatedSeats,
//     ],
//     title: "BMW 320d",
//     subtitle: "Sport Line 2020",
//     description:
//       "BMW 320d Sport Line in excellent condition, full service history, no accidents. Equipped with navigation, leather interior, and heated seats.",
//     location: "Kobyłka (Mazowieckie)",
//     sellerType: SellerTypeEnum.Private,
//     price: 10000,
//     currency: CurrencyTypeEnum.Eur,
//     createdDate: new Date("2025-10-20T05:17:30"),
//   },
//   {
//     offerId: "test_1",

//     makeId: 582,//AUDI
//     modelId: 3146,//A4
//     year: 2021,
//     mileage: 62000,
//     fuelType: FuelTypeEnum.Diesel,
//     engineDisplacement: 1968,
//     enginePower: 204,
//     transmission: TransmissionTypeEnum.SemiAutomatic,
//     color: "Silver",
//     vin: "WAUZZZF47MA012345",
//     features: [
//       FeatureTypeEnum.ParkingSensors,
//       FeatureTypeEnum.BackupCamera,
//       FeatureTypeEnum.AlloyWheels,
//       FeatureTypeEnum.Bluetooth,
//       FeatureTypeEnum.Sunroof,
//     ],
//     title: "Audi A4",
//     subtitle: "2.0 TDI S-Line",
//     description:
//       "Audi A4 S-Line 2.0 TDI with automatic transmission, well maintained and fully loaded with premium features such as sunroof and parking sensors.",
//     location: "Warszawa (Mazowieckie)",
//     sellerType: SellerTypeEnum.Institutional,
//     price: 15000,
//     currency: CurrencyTypeEnum.Usd,
//     createdDate: new Date("2025-10-27T10:15:00"),
//   },
// ];

const MainSearch = () => {
  const [pagedOffers, setPagedOffers] = useState<PagedResult<OfferProps> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 2;

  const handlePageChange = (e: { selected: number }) => {
    setPageNumber(e.selected + 1);
  };

  return (
    <div className="main-search">
      <div className="main-search-grid">
        <OffersFilters
          pageNumber={pageNumber}
          pageSize={pageSize}
          handleFilteredOffers={setPagedOffers}
          handleLoadingOffers={setLoading}
        />
        <span className="main-search-offers-category-title">Passenger Cars</span>
        <span className="main-search-offers-amount">Offers found: {pagedOffers?.totalCount}</span>
        <OffersList offers={pagedOffers?.items} isLoadingOffers={loading} />
        {pagedOffers && pagedOffers.totalCount > pageSize && (
          <ReactPaginate
            className="main-search-pagination"
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            pageCount={Math.ceil(pagedOffers.totalCount / pageSize)}
            onPageChange={handlePageChange}
            forcePage={pageNumber - 1}
          />
        )}
      </div>
    </div>
  );
}

export default MainSearch