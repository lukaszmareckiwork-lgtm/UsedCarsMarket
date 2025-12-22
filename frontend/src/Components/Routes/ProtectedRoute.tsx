import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { ROUTES } from "../../Routes/Routes";

type Props = { children: React.ReactNode };

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

    return isLoggedIn() ? (
        <>{children}</>
    ) :
    (
        <Navigate to={ROUTES.LOGIN} state={{ returnTo: location.pathname + location.search }} replace/>
    );
};

export default ProtectedRoute;
