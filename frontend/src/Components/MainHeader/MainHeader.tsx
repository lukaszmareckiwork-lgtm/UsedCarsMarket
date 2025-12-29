import { Link, useLocation } from "react-router-dom";
import "./MainHeader.css";
import { useAuth } from "../../Context/useAuth";
import FavouritesButton from "../FavouritesButton/FavouritesButton";
import { PiLineVertical } from "react-icons/pi";
import { useFavourites } from "../../Context/useFavourites";
import { ROUTES } from "../../Routes/Routes";
import OwnedOffersButton from "../OwnedOffersButton/OwnedOffersButton";
import { useUserOffers } from "../../Context/useUserOffers";

const MainHeader = () => {
  const location = useLocation();

  const isAddOfferPage = location.pathname === ROUTES.ADD_OFFER;

  const { isLoggedIn, user, logoutUser } = useAuth();
  const { favouritesCount } = useFavourites(); 
  const { userOffersCount } = useUserOffers();

  return (
    <div className="mainHeader">
      <div className="mainHeader-left">
        <Link to={ROUTES.HOME} className="mainHeader-title">
          Used Cars Market
        </Link>
      </div>
      <div className="mainHeader-right">
        <FavouritesButton count={favouritesCount} />
        <PiLineVertical size={40} color={"var(--colorsPlaceholder)"} />
        {isLoggedIn() ? (
          <>
            <div className="mainHeader-loggedInUserText">
              Welcome,<br/>{user?.username}
            </div>
            <button className="mainHeader-loginButton main-button" onClick={logoutUser}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LOGIN} className="mainHeader-loginButton main-button">
              Login
            </Link>
            <Link to={ROUTES.REGISTER} className="mainHeader-loginButton main-button">
              Register
            </Link>
          </>
        )}

        <PiLineVertical size={40} color={"var(--colorsPlaceholder)"} />
        <OwnedOffersButton count={userOffersCount} />
        {!isAddOfferPage && <Link to={ROUTES.ADD_OFFER} className="mainHeader-addOfferButton main-button">
          Add offer
        </Link>}
      </div>
    </div>
  );
};

export default MainHeader;
