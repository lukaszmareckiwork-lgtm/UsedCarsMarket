import "./FeaturesList.css";
import {
  getReadableFeatureType,
  type OfferProps,
} from "../../../Data/OfferProps";
import Feature from "../Feature/Feature";

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
