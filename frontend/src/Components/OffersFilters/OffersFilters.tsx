import React from 'react'
import "./OffersFilters.css"
import OffersFiltersControls, { type OffersFiltersControlsResult } from '../OffersFiltersControls/OffersFiltersControls'
import type { OfferProps } from '../../Data/OfferProps'

interface Props{
    allOffers: OfferProps[];
    handleFilteredOffers: (filteredOffers: OfferProps[]) => void;
}

const OffersFilters = ( { allOffers, handleFilteredOffers }: Props) => {

    const handleFiltersResult = (fRes: OffersFiltersControlsResult) => {
        let filteredOffers = [...allOffers];

        filteredOffers = filteredOffers.filter(offer => {
            if (fRes.selModels.length > 0) {
                return fRes.selModels.some(m => m.model_id === offer.modelId);
            }

            if (fRes.selMakes.length > 0) {
                return fRes.selMakes.some(m => m.make_id === offer.makeId);
            }

            return true; // nothing selected → include all
        });

        handleFilteredOffers(filteredOffers);
      }
  return (
    <OffersFiltersControls handleFiltersResult={handleFiltersResult}/>
  )
}

export default OffersFilters