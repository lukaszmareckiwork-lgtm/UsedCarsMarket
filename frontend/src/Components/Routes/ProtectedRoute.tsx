import type { ReactNode } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/useAuth";
import { ROUTES } from "@routes/Routes";

type Props = { children: ReactNode };

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
