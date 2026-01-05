import "./DetailsSidePanel.css"
import { getReadableSellerType, SellerTypeEnum, type OfferProps } from '@data/OfferProps'
import DetailsItem from "@components/DetailsPage/DetailsItem/DetailsItem"
import { FaIdCard, FaTools } from "react-icons/fa"
import HiddenString from "@components/HiddenString/HiddenString"
import { GoPersonFill } from "react-icons/go"
import { PiBuildingOfficeBold } from "react-icons/pi"
import Spacer from "@components/Spacer/Spacer"
import { IoEarth } from "react-icons/io5"
import AddFavouritesButton from "@components/AddFavouritesButton/AddFavouritesButton"
import { useAuth } from "@context/useAuth"
import { useState } from "react"
import { toast } from "react-toastify"
import { useUserOffers } from "@context/useUserOffers"
import BlockingLoader from "@components/BlockingLoader/BlockingLoader"
import { useRedirectBack } from "@helpers/useRedirectBack"

interface Props {
  offerProps: OfferProps
}

const DetailsSidePanel = ({ offerProps }: Props) => {
  const { deleteOffer } = useUserOffers();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const { redirect } = useRedirectBack();

  const handleOfferDelete = async (offerId: number) => {
    // console.log("handleOfferDelete:", offerId);
    setLoading(true);

    try {
      await deleteOffer(offerId);
      toast.success("Offer deleted successfully!");
      redirect(true);
    } catch (e) {
      console.error("DELETE OFFER ERROR:", e);
      toast.warning("Server error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="details-side-panel">
      <DetailsItem label="Seller Info" iconNode={<FaIdCard size={22} aria-hidden={true} focusable={false}/> }>
        <div className="details-side-panel-content">
          <div className="details-side-panel-content-seller-type">
            {offerProps.sellerDto.sellerType == SellerTypeEnum.Private &&
              <GoPersonFill size={16} aria-hidden={true} focusable={false}/>    
            }
            {offerProps.sellerDto.sellerType == SellerTypeEnum.Institutional &&
              <PiBuildingOfficeBold size={16} aria-hidden={true} focusable={false}/>    
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
              <IoEarth size={16} aria-hidden={true} focusable={false}/>
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
      {user?.id === offerProps.sellerDto.userId && <DetailsItem label="Manage offer" iconNode={<FaTools size={22} aria-hidden={true} focusable={false}/> }>
        <BlockingLoader isLoading={loading} size={28}>
          <button className="delete-button" onClick={() => handleOfferDelete(offerProps.id)}>
              Delete offer
          </button>
        </BlockingLoader>
      </DetailsItem>}
    </div>
  )
}

export default DetailsSidePanel