import { FaHeart } from "react-icons/fa";
import "./FavouritesButton.css";
import { Link } from "react-router-dom";

type Props = {
  isLoggedIn: boolean;
  count: number;
  loggedInLinkTo: string;
  notLoggedInLinkTo: string;
};

const FavouritesButton = ({ isLoggedIn, count, loggedInLinkTo, notLoggedInLinkTo }: Props) => {
  const linkTo = isLoggedIn ? loggedInLinkTo : notLoggedInLinkTo;

  return (
    <Link to={linkTo} className="favourites-button">
      <FaHeart size={28} />
      <div className="favourites-button-count-text">{count > 0 && `(${count})`}</div>
    </Link>
  );
};

export default FavouritesButton;
