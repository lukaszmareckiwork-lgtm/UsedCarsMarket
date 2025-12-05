import "./OffersFilters.css"
import OffersFiltersControls, { type OffersFiltersControlsResult } from '../OffersFiltersControls/OffersFiltersControls'
import type { OfferProps } from '../../Data/OfferProps'
import { offerPreviewGetApi } from '../../Services/OfferService';
import type { PagedResult } from "../../Helpers/PagedResult";
import { useEffect, useState } from "react";

interface Props{
  pageNumber: number;
  pageSize: number;
  handleFilteredOffers: (filteredOffers: PagedResult<OfferProps>) => void;
  handleLoadingOffers: (isLoadingOffers: boolean) => void;
}

const OffersFilters = ( { pageNumber, pageSize, handleFilteredOffers, handleLoadingOffers }: Props) => {
  const [filtersResult, setFiltersResult] = useState<OffersFiltersControlsResult | null>(null);

  useEffect(() =>{
    if(filtersResult == null)
      return;

    getOffers(filtersResult);
  }, [pageNumber, pageSize])

  const getOffers = (fRes: OffersFiltersControlsResult) => {
    setFiltersResult(fRes);
    handleLoadingOffers(true);

    const onlyFavourites = fRes.onlyFavourites;
    const createdById = fRes.createdById;//add to offer service
    const makes = fRes.selMakes.map((x) => x.make_id);
    const models = fRes.selModels.map((x) => x.model_id);

    offerPreviewGetApi(onlyFavourites, pageNumber, pageSize, makes, models, createdById)?.then((res) => {
      handleLoadingOffers(false);
      
      if(res?.data != undefined)
        handleFilteredOffers(res?.data);
    });
  };

  return (
    <OffersFiltersControls
      handleFiltersResult={getOffers}
      handleLoadingTimeout={handleLoadingOffers}
    />
  );
}

export default OffersFilters