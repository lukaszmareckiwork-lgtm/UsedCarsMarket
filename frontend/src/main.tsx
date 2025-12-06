import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { MakesProvider } from "./Context/MakesContext.tsx";
import { UserProvider } from "./Context/useAuth.tsx";
import { FavouritesProvider } from "./Context/useFavourites.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MakesProvider>
        <UserProvider>
          <FavouritesProvider>
            <App />
          </FavouritesProvider>
        </UserProvider>
      </MakesProvider>
    </BrowserRouter>
  </StrictMode>
);
