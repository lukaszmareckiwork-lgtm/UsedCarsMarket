import { Routes, Route } from "react-router-dom";
import MainHeader from './Components/MainHeader/MainHeader';
import MainSearch from './Components/MainSearch/MainSearch';
import AddOfferForm from './Components/AddOfferForm/AddOfferForm';
import './App.css';
import AddOffer from "./Components/AddOffer/AddOffer";

function App() {
  return (
    <>
      <MainHeader />
      <Routes>
        <Route path="/" element={<MainSearch />} />
        <Route path="/passenger-cars" element={<MainSearch />} />
        <Route path="/add-offer" element={<AddOffer />} />
      </Routes>
    </>
  );
}

export default App;
