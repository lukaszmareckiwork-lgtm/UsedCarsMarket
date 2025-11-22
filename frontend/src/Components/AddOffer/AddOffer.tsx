import React from 'react'
import AddOfferForm from '../AddOfferForm/AddOfferForm'
import "./AddOffer.css"
import type { OfferProps } from '../../Data/OfferProps'
import { offerPostApi } from '../../Services/OfferService'
import { toast } from 'react-toastify'

const AddOffer = () => {
    const handleOfferSubmit = (newOffer: OfferProps) => {
        console.log("handleOfferSubmit:", newOffer);

        //add offer to database logic
        offerPostApi(newOffer)
            ?.then(res => {
                console.log("offerPostApi - then:", res);

                if(res){
                    toast.success("Offer created successfully!");
                }
            }).catch(e =>{
                console.log("offerPostApi - catch:", e);
                toast.warning(e.message);
            })
    };

    return (
        <AddOfferForm handleOfferFormSubmit={handleOfferSubmit} />
    )
}

export default AddOffer