import { isAxiosError } from "axios"
import { toast } from "react-toastify";
import { ROUTES } from "../Routes/Routes";

export const handleError = (error: any) => {
  let message = "Unknown error occurred";

  if (isAxiosError(error)) {
    console.group("Axios Error");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response data:", error.response?.data);
    console.error("Request:", error.request);
    console.groupEnd();
  } else {
    console.group("Non-Axios Error");
    console.error(error);
    console.groupEnd();
  }

  if (isAxiosError(error)) {
    const err = error.response;
    message = error?.message;

    if (Array.isArray(err?.data?.errors)) {
      message = err.data.errors.map((e: any) => e.description).join(", ");
    } else if (typeof err?.data?.errors === "object") {
      message = Object.values(err.data.errors)
        .flat()
        .join(", ");
    } else if (err?.data) {
      // message = typeof err.data === "string" ? err.data : JSON.stringify(err.data);
    } else if (err?.status === 401) {
      message = "Please login!";
      window.history.pushState({}, "LoginPage", ROUTES.LOGIN);
    }
  }

  toast.warning(message);

  // Optional: throw so the caller can catch
  // throw error;
};