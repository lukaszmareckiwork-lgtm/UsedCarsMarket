import { Routes, Route } from "react-router-dom";
import MainHeader from './Components/MainHeader/MainHeader';
import MainSearch from './Components/MainSearch/MainSearch';
import './App.css';
import AddOffer from "./Components/AddOffer/AddOffer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import MainDetails from "./Components/DetailsPage/MainDetails/MainDetails";

function App() {
  return (
    <>
      <MainHeader />
      <Routes>
        <Route path="/" element={<MainSearch />} />
        <Route path="/passenger-cars" element={<MainSearch />} />
        <Route path="/add-offer" element={<ProtectedRoute><AddOffer /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/offer/details/:id" element={<MainDetails />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
