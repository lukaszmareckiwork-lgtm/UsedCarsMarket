import type { NavigateFunction, Location } from "react-router-dom";
import { ROUTES } from "@routes/Routes";

/**
 * Redirects non-logged-in users to login page and stores the original location
 * @param navigate react-router navigate function
 * @param location current location object
 */
export const redirectToLoginWithReturn = (navigate: NavigateFunction, location: Location) => {
  navigate(ROUTES.LOGIN, {
    state: { returnTo: location.pathname + location.search },
  });
};
