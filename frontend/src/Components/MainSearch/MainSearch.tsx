import React from 'react'
import "./MainSearch.css";
import OffersList from '../OffersList/OffersList';
import CarFilters from '../CarFilters/CarFilters';
import type { OfferProps } from '../../Data/OfferProps';

const offersData: OfferProps[] = [
  {
    title: "BMW 320d",
    subtitle: "Sport Line 2020",
    location: "Kobyłka (Mazowieckie)",
    sellerType: 'Private',
    createdDate: new Date("2025-10-20T05:17:30"),
    price: 10000,
    currency: "EUR"
  },
  {
    title: "Audi A4",
    subtitle: "2.0 TDI S-Line",
    location: "Warszawa (Mazowieckie)",
    sellerType: "Institutional",
    createdDate: new Date("2025-10-27T10:15:00"),
    price: 15000,
    currency: "USD"
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