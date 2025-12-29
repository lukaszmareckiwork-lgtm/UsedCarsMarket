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
        <button
          type="button"
          className="rcb-button"
          aria-label="Clear"
          onClick={(e) => {
            e.stopPropagation();
            onClicked();
          }}
        >
          <IoClose className="rcb-button-icon" size={28} aria-hidden="true" focusable={false} />
        </button>
      )}
    </div>
  );
};

export default RedCrossButton;
