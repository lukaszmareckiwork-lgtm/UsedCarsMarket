import "./Spinner.css";
import { ClipLoader } from "react-spinners";

type Props = {
  isLoading?: boolean;
  overlay?: boolean;
  size?: number;
};

const Spinner = ({ isLoading = true, overlay = false, size = 35 }: Props) => {
  return (
    <div className={`loading-spinner ${overlay ? "overlay" : "inline"}`}>
      <ClipLoader
        color="#3697d7ff"
        loading={isLoading}
        size={size}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default Spinner;
