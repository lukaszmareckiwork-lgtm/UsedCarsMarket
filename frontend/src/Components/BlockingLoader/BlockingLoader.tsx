import React from "react";
import "./BlockingLoader.css";
import Spinner from "../Spinner/Spinner";

type Props = {
  isLoading: boolean;
  size?: number;
  children: React.ReactNode;
};

const BlockingLoader = ({ isLoading, size: spinnerSize = 24, children }: Props) => {
  return (
    <div className={`blocking-loader ${isLoading ? "is-loading" : ""}`}>
      {children}

      {isLoading && (
        <div className="blocking-loader-overlay">
          <Spinner overlay size={spinnerSize} />
        </div>
      )}
    </div>
  );
};

export default BlockingLoader;
