import type { JSX } from 'react'
import './OffersList.css'
import Offer from '../Offer/Offer'
import type { OfferProps } from '../../Data/OfferProps'
import Spinner from '../Spinner/Spinner'


const OffersList: React.FC<{offers: OfferProps[] | undefined, isLoadingOffers: boolean}> = ({offers, isLoadingOffers}): JSX.Element => {
  return (
    <div className="offersList" style={{ position: "relative" }}>
      {isLoadingOffers && <Spinner overlay={true}/>}
      {/* {true && <Spinner overlay={true}/>} */}
      {offers?.map((offer, i) => (
        <Offer key={i} offerProps={offer} />
      ))}
    </div>
  );
}

export default OffersList