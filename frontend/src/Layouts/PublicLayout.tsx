import { Outlet } from "react-router-dom";
import MainHeader from "@components/MainHeader/MainHeader";
import "./GlobalLayout.css";

const PublicLayout = () => {
  return (
    <div className="app-root">
      <MainHeader />
      <main id="main-content" className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
