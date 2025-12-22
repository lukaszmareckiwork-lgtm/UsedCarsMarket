import MainHeader from "../Components/MainHeader/MainHeader";
import { Outlet } from "react-router-dom";
import "./GlobalLayout.css";

const AppLayout = () => {
  return (
    <div className="app-root">
      <MainHeader />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
