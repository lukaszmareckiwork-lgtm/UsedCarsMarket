import React from 'react'
import AddOfferForm from '../AddOfferForm/AddOfferForm'
import "./AddOffer.css"
import type { OfferProps } from '../../Data/OfferProps'

const AddOffer = () => {
    const handleOfferSubmit = (newOffer: OfferProps) => {
        //add offer to database logic
    };

    return (
        <AddOfferForm handleOfferFormSubmit={handleOfferSubmit} />
    )
}

export default AddOffer