import React, { type JSX } from 'react'
import './OffersList.css'
import Offer from '../Offer/Offer'
import type { OfferProps } from '../../Data/OfferProps'


const OffersList: React.FC<{offers: OfferProps[]}> = ({offers}): JSX.Element => {
  return (
    <div className='offersList'>
      {offers.map((offer, i) => (
        <Offer key={i} offerProps={offer} />
      ))}
    </div>
  )
}

export default OffersList