import React from "react";
import "./MainFooter.css";

type Props = {};

const MainFooter = (props: Props) => {
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
      <p className="mainFooter-demo-info">It's a portfolio DEMO project not a fully functional app.</p>
    </footer>
  );
};

export default MainFooter;
