import { useEffect } from "react";
import { toast } from "react-toastify";
import { getIsReady, waitForReady } from "@services/HealthService";

const TOAST_ID = "health-banner";

export default function HealthBanner() {
  useEffect(() => {
    // If already ready, nothing to do
    if (getIsReady()) return;

    // Show initial banner after a small delay so short failures don't flash UI
    const shortDelay = 4000;
    const shortTimer = setTimeout(() => {
      // console.log("Showing health banner toast");
      toast.info("Backend is waking up from paused state. This can take up to 2 minutes.", {
        autoClose: false,
        toastId: TOAST_ID,
      });
    }, shortDelay);

    // Start shared wait; when it resolves, dismiss banner. On failure, show an error briefly.
    waitForReady()
      .then(() => {
        // console.log("Health banner dismissing toast");
        clearTimeout(shortTimer);
        toast.dismiss(TOAST_ID);
      })
      .catch(() => {
        clearTimeout(shortTimer);
        try {
          // console.log("Updating health banner toast to error");
          toast.update(TOAST_ID, {
            render: "Server is unavailable. Please try again later.",
            type: "error",
            autoClose: 5000,
          });
        } catch (e) {
          // console.log("Showing health banner error toast");
          // if toast wasn't shown yet, show an error toast
          toast.error("Server is unavailable. Please try again later.");
        }
      });

    return () => clearTimeout(shortTimer);
  }, []);

  return null;
}
