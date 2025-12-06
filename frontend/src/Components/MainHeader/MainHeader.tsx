import { Link, useLocation } from "react-router-dom";
import "./MainHeader.css";
import { useAuth } from "../../Context/useAuth";
import FavouritesButton from "../FavouritesButton/FavouritesButton";
import { PiLineVertical } from "react-icons/pi";
import { useFavourites } from "../../Context/useFavourites";
import { ROUTES } from "../../Routes/Routes";

const MainHeader = () => {
  const location = useLocation();

  const isAddOfferPage = location.pathname === ROUTES.ADD_OFFER;

  const { isLoggedIn, user, logoutUser } = useAuth();
  const { favouritesCount } = useFavourites(); 

  return (
    <div className="mainHeader">
      <div className="mainHeader-left">
        <Link to={ROUTES.HOME} className="mainHeader-title">
          Used Cars Market
        </Link>
      </div>
      <div className="mainHeader-right">
        <FavouritesButton count={favouritesCount} />
        <PiLineVertical size={40} color="#ddddddff" />
        {isLoggedIn() ? (
          <>
            <div className="mainHeader-loggedInUserText">
              Welcome,<br/>{user?.username}
            </div>
            <button className="mainHeader-loginButton" onClick={logoutUser}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LOGIN} className="mainHeader-loginButton">
              Login
            </Link>
            <Link to={ROUTES.REGISTER} className="mainHeader-loginButton">
              Register
            </Link>
          </>
        )}

        {!isAddOfferPage && (
          <>
            <PiLineVertical size={40} color="#ddddddff" />
            <Link to={ROUTES.ADD_OFFER} className="mainHeader-addOfferButton">
              Add offer
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MainHeader;
