import { Link, useLocation } from "react-router-dom";
import "./MainHeader.css";
import { useAuth } from "@context/useAuth";
import FavouritesButton from "@components/FavouritesButton/FavouritesButton";
import { PiLineVertical } from "react-icons/pi";
import { useFavourites } from "@context/useFavourites";
import { ROUTES } from "@routes/Routes";
import OwnedOffersButton from "@components/OwnedOffersButton/OwnedOffersButton";
import { useUserOffers } from "@context/useUserOffers";

const MainHeader = () => {
  const location = useLocation();

  const isAddOfferPage = location.pathname === ROUTES.ADD_OFFER;

  const { isLoggedIn, user, logoutUser } = useAuth();
  const { favouritesCount } = useFavourites(); 
  const { userOffersCount } = useUserOffers();

  return (
    <header className="mainHeader" role="banner">
      <div className="mainHeader-left">
        <Link to={ROUTES.HOME} className="mainHeader-title">
          Used Cars Market
        </Link>
        <h2 className="mainHeader-subtitle">Portfolio DEMO project by Łukasz Marecki</h2>
      </div>
      <nav className="mainHeader-right" aria-label="Primary">
        <FavouritesButton count={favouritesCount} />
        <PiLineVertical size={40} color={"var(--colorsPlaceholder)"} aria-hidden="true" focusable={false} />
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

        <PiLineVertical size={40} color={"var(--colorsPlaceholder)"} aria-hidden="true" focusable={false} />
        <OwnedOffersButton count={userOffersCount} />
        {!isAddOfferPage && <Link to={ROUTES.ADD_OFFER} className="mainHeader-addOfferButton main-button">
          Add offer
        </Link>}
      </nav>
    </header>
  );
};

export default MainHeader;
