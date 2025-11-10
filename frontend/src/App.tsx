import { Routes, Route } from "react-router-dom";
import MainHeader from './Components/MainHeader/MainHeader';
import MainSearch from './Components/MainSearch/MainSearch';
import AddOffer from './Components/AddOffer/AddOffer';
import './App.css';

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
