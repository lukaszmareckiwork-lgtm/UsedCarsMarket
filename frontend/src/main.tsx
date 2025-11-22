import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { MakesProvider } from "./context/MakesContext.tsx";
import { UserProvider } from "./Context/useAuth.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MakesProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </MakesProvider>
    </BrowserRouter>
  </StrictMode>
);
