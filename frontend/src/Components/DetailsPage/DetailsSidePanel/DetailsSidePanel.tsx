import "./DetailsSidePanel.css"
import { getReadableSellerType, SellerTypeEnum, type OfferProps } from '../../../Data/OfferProps'
import DetailsItem from "../DetailsItem/DetailsItem"
import { FaIdCard } from "react-icons/fa"
import HiddenString from "../../HiddenString/HiddenString"
import { GoPersonFill } from "react-icons/go"
import { PiBuildingOfficeBold } from "react-icons/pi"
import Spacer from "../../Spacer/Spacer"
import { IoEarth } from "react-icons/io5"
import AddFavouritesButton from "../../AddFavouritesButton/AddFavouritesButton"

interface Props {
  offerProps: OfferProps
}

const DetailsSidePanel = ({ offerProps }: Props) => {
  return (
    <div className="details-side-panel">
      <DetailsItem label="Seller Info" iconNode={<FaIdCard size={22}/>}>
        <div className="details-side-panel-content">
          <div className="details-side-panel-content-seller-type">
            {offerProps.sellerDto.sellerType == SellerTypeEnum.Private &&
              <GoPersonFill size={16}/>    
            }
            {offerProps.sellerDto.sellerType == SellerTypeEnum.Institutional &&
              <PiBuildingOfficeBold size={16}/>    
            }
            {getReadableSellerType(offerProps.sellerDto.sellerType)}
          </div>
          <p className="details-side-panel-username">{offerProps.sellerDto.username}</p>
          <Spacer size={14} />
          {offerProps.sellerDto.phoneNumber && <HiddenString text={`Phone: ${offerProps.sellerDto.phoneNumber}`} signsVisible={12} />}
          <HiddenString text={`E-mail: ${offerProps.sellerDto.email}`} signsVisible={11} />
          <Spacer size={14} />
          <div className="details-side-panel-location-wrapper">
            <div className="details-side-panel-location-title">
              <IoEarth size={16}/>
              <span>Location</span>
            </div>
            <div className="details-side-panel-location-data">
              <p>{offerProps.locationName}</p>
            </div>
          </div>
          <Spacer size={24} />
          <div className="details-side-panel-favourite-button">
            <AddFavouritesButton offerProps={offerProps} />
          </div>
          <span className="details-side-panel-created-id">
            <p>Advert created: {new Date(offerProps.createdDate).toLocaleDateString()} {new Date(offerProps.createdDate).toLocaleTimeString()}</p>
            <p>ID: {offerProps.id}</p>
            {/* <p className="details-side-panel-created">Advert updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p> */}
          </span>
        </div>
      </DetailsItem>
    </div>
  )
}

export default DetailsSidePanel