import React from "react";
import { IoClose } from "react-icons/io5";
import "./RedCrossButton.css";

type Props = {
  classname?: string;
  renderButton: boolean;
  onClicked: () => void;
};

const RedCrossButton = ({ classname, renderButton, onClicked }: Props) => {
  return (
    <div className={`rcb ${classname ? classname : ""}`}>
      {renderButton && (
        <span 
          className="rcb-button" 
          role="button" 
          onClick={(e) => {
            e.stopPropagation();
            onClicked();
            }}>
          <IoClose className="rcb-button-icon" size={28} />
        </span>
      )}
    </div>
  );
};

export default RedCrossButton;
