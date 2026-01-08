import "./MainFooter.css";
import Spacer from "@components/Spacer/Spacer";

const MainFooter = () => {
  return (
    <footer className="mainFooter">
      <p>© 2026 Łukasz Marecki</p>
      <p>
        Contact:{" "}
        <a href="mailto:lukaszmarecki.work@gmail.com">
          lukaszmarecki.work@gmail.com
        </a>
      </p>
      <p>
        <a
          href="https://github.com/lukaszmareckiwork-lgtm/UsedCarsMarket"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        {" | "}
        <a
          href="https://www.linkedin.com/in/łukasz-marecki-651b52346"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </p>
      <Spacer size={8} />
      <p className="mainFooter-demo-info">Used Cars Market — Portfolio Demo</p>
      <p className="mainFooter-demo-info">Built with React (TypeScript) · ASP.NET Core · SQL Server</p>
    </footer>
  );
};

export default MainFooter;
