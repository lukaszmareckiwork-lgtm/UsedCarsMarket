import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./Styles/index.css";
import App from "./App.tsx";
import { MakesProvider } from "./Context/MakesContext.tsx";
import { UserProvider } from "./Context/useAuth.tsx";
import { FavouritesProvider } from "./Context/useFavourites.tsx";
import { UserOffersProvider } from "./Context/useUserOffers.tsx";
import HealthBanner from "./Components/HealthBanner/HealthBanner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MakesProvider>
        <HealthBanner />
        <UserProvider>
          <FavouritesProvider>
            <UserOffersProvider>
              <App />
            </UserOffersProvider>
          </FavouritesProvider>
        </UserProvider>
      </MakesProvider>
    </BrowserRouter>
  </StrictMode>
);
