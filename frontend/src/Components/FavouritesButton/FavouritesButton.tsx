import { FaHeart } from "react-icons/fa";
import "./FavouritesButton.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { ROUTES } from "../../Routes/Routes";
import { redirectToLoginWithReturn } from "../../Helpers/redirectToLoginWithReturn";

type Props = {
  count: number;
};

const FavouritesButton = ({ count }: Props) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      redirectToLoginWithReturn(navigate, location); // <- use utility here
    }
  };

  const disabled = isLoggedIn() && count === 0;

  return (
    <a
      href={ROUTES.PASSENGER_CARS_FAVOURITES}
      className={`favourites-button ${disabled ? "disabled" : ""}`}
      onClick={handleClick}
    >
      <FaHeart size={28} />
      <div className="favourites-button-count-text">{count > 0 && `(${count})`}</div>
    </a>
  );
};

export default FavouritesButton;
