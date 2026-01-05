import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@routes/Routes";

export const useRedirectBack = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const returnTo = location.state?.returnTo || ROUTES.HOME;

  const redirect = (replace: boolean = false) => {
    navigate(returnTo, { replace });
  };

  return { returnTo, redirect };
};