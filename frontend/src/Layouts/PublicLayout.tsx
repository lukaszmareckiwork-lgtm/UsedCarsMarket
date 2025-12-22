import { Outlet } from "react-router-dom";
import MainHeader from "../Components/MainHeader/MainHeader";
import "./GlobalLayout.css";

const PublicLayout = () => {
  return (
    <div className="app-root">
      <MainHeader />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
