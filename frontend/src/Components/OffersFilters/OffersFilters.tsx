import "./OffersFilters.css"
import OffersFiltersControls, { type OffersFiltersControlsResult } from '../OffersFiltersControls/OffersFiltersControls'
import type { OfferProps } from '../../Data/OfferProps'
import { offerGetApi } from '../../Services/OfferService';

interface Props{
    handleFilteredOffers: (filteredOffers: OfferProps[]) => void;
    handleLoadingOffers: (isLoadingOffers: boolean) => void;
}

const OffersFilters = ( { handleFilteredOffers, handleLoadingOffers }: Props) => {
  // const [loading, setLoading] = useState<boolean>();

  function normalizeOffer(o: OfferProps): OfferProps {
    return {
      ...o,
      createdDate: new Date(o.createdDate),
    };
  }

  const getOffers = (fRes: OffersFiltersControlsResult) => {
    handleLoadingOffers(true);

    const makes = fRes.selMakes.map((x) => x.make_id);
    const models = fRes.selModels.map((x) => x.model_id);

    offerGetApi(makes, models)?.then((res) => {
      handleLoadingOffers(false);
      const offers = res?.data!.items!.map(normalizeOffer);
      handleFilteredOffers(offers);
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