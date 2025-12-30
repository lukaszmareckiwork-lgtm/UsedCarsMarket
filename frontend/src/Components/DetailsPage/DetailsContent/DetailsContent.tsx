import "./DetailsContent.css"
import PhotoViewer from '../PhotoViewer/PhotoViewer'
import { getReadableCurrencyType, type OfferProps } from '../../../Data/OfferProps'
import ParamsWithIcons from '../../ParamsWithIcons/ParamsWithIcons'
import FeaturesList from "../FeaturesList/FeaturesList"
import DetailsItem from "../DetailsItem/DetailsItem"
import { FaBars, FaCar, FaList, FaMapMarkedAlt } from "react-icons/fa"
import { IoMdSettings } from "react-icons/io"
import SpecsList from "../SpecsList/SpecsList"
import { LocationPicker, LocationPickerModeEnum } from "../../LocationPicker/LocationPicker"

interface Props {
  offerProps: OfferProps
}

const DetailsContent = ({ offerProps }: Props) => {
  return (
    <div className="details-content-wrapper">
      <div className="details-content">
        <DetailsItem>
          <PhotoViewer offerProps={offerProps}/>
          <div className="details-content-title-price-wrapper">
            <span>
              <h1 className="details-content-title">{offerProps.title}</h1>
              <p className="details-content-subtitle">{offerProps.subtitle}</p>
            </span>
            <span>
                <div className="offer-price-holder">
                  <h3 className="offer-price-value">
                    {Intl.NumberFormat("pl-PL").format(offerProps.price)}
                  </h3>
                  <p className="offer-price-currency">
                    {getReadableCurrencyType(offerProps.currency)}
                  </p>
                </div>
            </span>
          </div>
        </DetailsItem>
        <DetailsItem label="Key Specifications" iconNode={<FaCar size={22} aria-hidden={true} focusable={false}/>}>
          <ParamsWithIcons offerProps={offerProps} iconSize={36} hideLabel={false} spaceEvenly={true}/>
        </DetailsItem>
        <DetailsItem className="details-content-description" label="Description" iconNode={<FaBars size={22} aria-hidden={true} focusable={false}/>}>
          {offerProps.description}
        </DetailsItem>
        <DetailsItem label="Specifications" iconNode={<IoMdSettings size={22} aria-hidden={true} focusable={false}/>}>
          <SpecsList offerProps={offerProps} />
        </DetailsItem>
        <DetailsItem label="Features" iconNode={<FaList size={22} aria-hidden={true} focusable={false}/>}>
          <FeaturesList offerProps={offerProps} />
        </DetailsItem>
        <DetailsItem label="Location" iconNode={<FaMapMarkedAlt size={22} aria-hidden={true} focusable={false}/>}>
          <LocationPicker
            mode={LocationPickerModeEnum.OnlyShow}
            targetCoordinates={{lat: offerProps.locationLat, lng: offerProps.locationLong}}
          />
        </DetailsItem>
      </div>
    </div>
  )
}

export default DetailsContent