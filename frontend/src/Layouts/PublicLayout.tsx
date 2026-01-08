import { Outlet } from "react-router-dom";
import MainHeader from "@components/MainHeader/MainHeader";
import "./GlobalLayout.css";
import MainFooter from "@components/MainFooter/MainFooter";

const PublicLayout = () => {
  return (
    <div className="app-root">
      <MainHeader />
      <main id="main-content" className="app-content">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
};

export default PublicLayout;
