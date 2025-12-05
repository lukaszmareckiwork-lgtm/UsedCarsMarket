import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./MainHeader.css";
import { useAuth } from "../../Context/useAuth";

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAddOfferPage = location.pathname === "/add-offer";

  const { isLoggedIn, user, logoutUser } = useAuth();

  return (
    <div className="mainHeader">
      <div className="mainHeader-left">
        <Link to="/" className="mainHeader-title">
          Used Cars Market
        </Link>
      </div>
      <div className="mainHeader-right">
        {isLoggedIn() ? (
          <>
            <div className="mainHeader-loggedInUserText">
                Welcome, {user?.username}.
            </div>
            <button className="mainHeader-loginButton" onClick={logoutUser}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mainHeader-loginButton">
              Login
            </Link>
            <Link to="/register" className="mainHeader-loginButton">
              Register
            </Link>
          </>
        )}

        {!isAddOfferPage && (
          <Link to="/add-offer" className="mainHeader-addOfferButton">
            Add offer
          </Link>
        )}
      </div>
    </div>
  );
};

export default MainHeader;
