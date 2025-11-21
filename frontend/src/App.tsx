import { Routes, Route } from "react-router-dom";
import MainHeader from './Components/MainHeader/MainHeader';
import MainSearch from './Components/MainSearch/MainSearch';
import './App.css';
import AddOffer from "./Components/AddOffer/AddOffer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./Pages/LoginPage/LoginPage";

function App() {
  return (
    <>
      <MainHeader />
      <Routes>
        <Route path="/" element={<MainSearch />} />
        <Route path="/passenger-cars" element={<MainSearch />} />
        <Route path="/add-offer" element={<AddOffer />} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
