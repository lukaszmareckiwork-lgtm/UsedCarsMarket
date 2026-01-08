import MainHeader from "@components/MainHeader/MainHeader";
import { Outlet } from "react-router-dom";
import "./GlobalLayout.css";
import MainFooter from "@components/MainFooter/MainFooter";

const AppLayout = () => {
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

export default AppLayout;
