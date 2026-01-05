import { Routes, Route } from "react-router-dom";
import MainSearch from './Components/MainSearch/MainSearch';
import AddOffer from "./Components/AddOffer/AddOffer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import MainDetails from "./Components/DetailsPage/MainDetails/MainDetails";
import { ROUTES } from "./Routes/Routes";

import AppLayout from "./Layouts/AppLayout";
import PublicLayout from "./Layouts/PublicLayout";
 
function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path={ROUTES.HOME} element={<MainSearch />} />
          <Route path={ROUTES.PASSENGER_CARS} element={<MainSearch />} />
          <Route path={ROUTES.ADD_OFFER} element={<ProtectedRoute><AddOffer /></ProtectedRoute>} />  
          <Route path={ROUTES.OFFER_DETAILS} element={<MainDetails />} />         
        </Route>
      </Routes>

      <ToastContainer 
        newestOnTop={true}
        style={{ top: "75px" }}
      />
    </>
  );
}

export default App;
