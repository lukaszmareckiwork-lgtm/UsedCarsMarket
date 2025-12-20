import React, { useState } from 'react'
import AddOfferForm from '../AddOfferForm/AddOfferForm'
import "./AddOffer.css"
import { toast } from 'react-toastify'
import type { CreateOfferRequestDto } from '../../Data/CreateOfferRequestDto'
import { useUserOffers } from '../../Context/useUserOffers'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../Routes/Routes'

const AddOffer = () => {
    const { addOffer } = useUserOffers();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleOfferSubmit = async (newOffer: CreateOfferRequestDto) => {
      console.log("handleOfferSubmit:", newOffer);

      setLoading(true);

      try {
        const res = await addOffer(newOffer);
        toast.success("Offer created successfully!");
        navigate(ROUTES.OFFER_DETAILS_BUILD(res.id));
      } catch (e) {
        console.error("ADD OFFER ERROR:", e);
        toast.warning("Server error occurred");
      } finally {
        setLoading(false);
      }
    };

    return (
        <AddOfferForm handleOfferFormSubmit={handleOfferSubmit} waitingForResponse={loading} />
    )
}

export default AddOffer