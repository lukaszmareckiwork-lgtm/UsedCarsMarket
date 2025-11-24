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

  function normalizeOffer(o: OfferProps): OfferProps {
    return {
      ...o,
      createdDate: new Date(o.createdDate),
    };
  }

  useEffect(() =>{
    if(filtersResult == null)
      return;

    getOffers(filtersResult);
  }, [pageNumber, pageSize])

  const getOffers = (fRes: OffersFiltersControlsResult) => {
    setFiltersResult(fRes);
    handleLoadingOffers(true);

    const makes = fRes.selMakes.map((x) => x.make_id);
    const models = fRes.selModels.map((x) => x.model_id);

    offerPreviewGetApi(pageNumber, pageSize, makes, models)?.then((res) => {
      handleLoadingOffers(false);

      if(res?.data != undefined){
        const data = res.data;
        const offers = res.data.items!.map(normalizeOffer) ?? [];
        data.items = offers;
        handleFilteredOffers(data);
      }
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