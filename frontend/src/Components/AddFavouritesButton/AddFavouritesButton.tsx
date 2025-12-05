import { FaHeart } from "react-icons/fa";
import "./AddFavouritesButton.css";

type Props = {
    isFavourite: boolean;
    handleOnClick: () => void;
}

const AddFavouritesButton = ({ isFavourite, handleOnClick }: Props) => {

  return (
    // <div className={`add-favourites-button ${!isFavourite ? "is-not-favourite" : ""}`}>
    <div className={`add-favourites-button`}>
        <button onClick={handleOnClick} className={`add-favourites-button-icon ${!isFavourite ? "is-not-favourite" : ""}`}>
            <FaHeart size={28} />
        </button>
    </div>
  )
}

export default AddFavouritesButton