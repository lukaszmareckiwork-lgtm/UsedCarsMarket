import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../Routes/Routes";

export const useRedirectAfterLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const returnTo = location.state?.returnTo || ROUTES.HOME;

  const redirect = () => {
    navigate(returnTo, { replace: true });
  };

  return { returnTo, redirect };
};