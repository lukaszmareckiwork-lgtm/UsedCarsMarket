import "./Spinner.css";
import { ClipLoader } from "react-spinners";

type Props = {
  isLoading?: boolean;
  overlay?: boolean;
  size?: number;
};

const Spinner = ({ isLoading = true, overlay = false, size = 35 }: Props) => {
  return (
    <div className={`loading-spinner ${overlay ? "overlay" : "inline"}`} role="status" aria-live="polite">
      <ClipLoader
        color="var(--colorsPrimaryDark)"
        loading={isLoading}
        size={size}
        aria-label="Loading Spinner"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
