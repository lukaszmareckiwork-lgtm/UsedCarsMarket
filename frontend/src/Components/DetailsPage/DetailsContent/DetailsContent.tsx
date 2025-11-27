import "./DetailsContent.css"
import PhotoViewer from '../PhotoViewer/PhotoViewer'
import { getReadableCurrencyType, type OfferProps } from '../../../Data/OfferProps'
import ParamsWithIcons from '../../ParamsWithIcons/ParamsWithIcons'
import FeaturesList from "../FeaturesList/FeaturesList"
import DetailsItem from "../DetailsItem/DetailsItem"
import { FaBars, FaCar, FaList } from "react-icons/fa"
import { IoMdSettings } from "react-icons/io"
import SpecsList from "../SpecsList/SpecsList"

interface Props {
  offerProps: OfferProps
}

const DetailsContent = ({ offerProps }: Props) => {
  return (
    <div className="details-content-wrapper">
      <div className="details-content">
        <DetailsItem>
          <PhotoViewer />
          <div className="details-content-title-price-wrapper">
            <span>
              <h1 className="details-content-title">{offerProps.title}</h1>
              <p className="details-content-subtitle">{offerProps.subtitle}</p>
            </span>
            <span>
                <div className="offerPriceHolder">
                  <h3 className="offerPriceValue">
                    {Intl.NumberFormat("pl-PL").format(offerProps.price)}
                  </h3>
                  <p className="offerPriceCurrency">
                    {getReadableCurrencyType(offerProps.currency)}
                  </p>
                </div>
            </span>
          </div>
        </DetailsItem>
        <DetailsItem label="Key Specifications" iconNode={<FaCar size={22}/>}>
          <ParamsWithIcons offerProps={offerProps} iconSize={36} hideLabel={false} spaceEvenly={true}/>
        </DetailsItem>
        <DetailsItem className="details-content-description" label="Description" iconNode={<FaBars size={22}/>}>
          {offerProps.description}
        </DetailsItem>
        <DetailsItem label="Specifications" iconNode={<IoMdSettings size={22}/>}>
          <SpecsList offerProps={offerProps} />
        </DetailsItem>
        <DetailsItem label="Features" iconNode={<FaList size={22}/>}>
          <FeaturesList offerProps={offerProps} />
        </DetailsItem>
      </div>
    </div>
  )
}

export default DetailsContent