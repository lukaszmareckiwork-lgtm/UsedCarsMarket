import "./FeaturesList.css";
import {
  getReadableFeatureType,
  type OfferProps,
} from "@data/OfferProps";
import Feature from "@components/DetailsPage/Feature/Feature";

interface Props {
  offerProps: OfferProps;
}

const FeaturesList = ({ offerProps }: Props) => {
  return (
    <div className="features-list-wrapper">
      <div className="features-list">
        {offerProps.features?.map((x, i) => (
          <Feature key={i} label={getReadableFeatureType(x)} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesList;
