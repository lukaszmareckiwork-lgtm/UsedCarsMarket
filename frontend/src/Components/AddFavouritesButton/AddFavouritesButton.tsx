import { FaHeart } from "react-icons/fa";
import "./AddFavouritesButton.css";
import type { OfferProps } from "@data/OfferProps";
import { useFavourites } from "@context/useFavourites";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@context/useAuth";
import { redirectToLoginWithReturn } from "@helpers/redirectToLoginWithReturn";

type Props = {
  offerProps: OfferProps
}

const AddFavouritesButton = ({ offerProps }: Props) => {
  const { isLoggedIn } = useAuth();
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();

  const navigate = useNavigate();
  const location = useLocation();
  const isFav = isFavourite(offerProps.id, offerProps.isFavourite);

  const handleAddRemoveFavouritesClick = () => {
    if (!isLoggedIn()) {
      redirectToLoginWithReturn(navigate, location);
      return;
    }

    if (isFav) removeFavourite(offerProps.id);
    else addFavourite(offerProps.id);
  };

  return (
    <div className={`add-favourites-button`}>
        <button 
          onClick={handleAddRemoveFavouritesClick} 
          className={`add-favourites-button-icon ${!isFav ? "is-not-favourite" : ""}`}>
            <FaHeart size={28} />
        </button>
    </div>
  )
}

export default AddFavouritesButton
