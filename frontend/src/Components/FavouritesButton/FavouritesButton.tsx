import { FaHeart } from "react-icons/fa";
import "./FavouritesButton.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { ROUTES } from "../../Routes/Routes";
import { redirectToLoginWithReturn } from "../../Helpers/redirectToLoginWithReturn";
import IconCounterButton from "../IconCounterButton/IconCounterButton";

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
    <IconCounterButton
      count={count}
      route={ROUTES.PASSENGER_CARS_FAVOURITES}
      icon={<FaHeart size={28} />}
      onClick={handleClick}
      disabled={disabled}
      />
  );
};

export default FavouritesButton;
