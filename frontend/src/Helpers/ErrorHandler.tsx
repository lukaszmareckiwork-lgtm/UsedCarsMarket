import { isAxiosError } from "axios"
import { toast } from "react-toastify";

// export const handleError = (error: any) =>{
//     if(isAxiosError(error)){
//         var err = error.response;
//         if(Array.isArray(err?.data.errors)){
//             for (let val of err?.data.errors) {
//                 toast.warning(val.description);
//             }
//         }else if(typeof err?.data.errors === 'object') {
//             for (let val of err?.data.errors) {
//                 toast.warning(err?.data.errors[val][0]);
//             }
//         }else if (err?.data){
//             toast.warning(err?.data);
//         }else if (err?.status == 401){
//             toast.warning("Please login!");
//             window.history.pushState({}, "LoginPage", "/login");
//         }else if (err){
//             toast.warning(err?.data);
//         }
//     }
// }

export const handleError = (error: any) => {
  let message = "Unknown error occurred";

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
      message = typeof err.data === "string" ? err.data : JSON.stringify(err.data);
    } else if (err?.status === 401) {
      message = "Please login!";
      window.history.pushState({}, "LoginPage", "/login");
    }
  }

  toast.warning(message);

  // Optional: throw so the caller can catch
  throw error;
};