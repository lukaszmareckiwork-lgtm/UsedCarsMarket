import { API_URL } from "@config/env";
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  __isRetry?: boolean;
};

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    // Guard: no config or already retried
    if (!config || config.__isRetry) {
      return Promise.reject(error);
    }

    // Cold-start / wake-up signatures
    const isNetworkError =
      !error.response &&
      (error.message === "Network Error" ||
       error.code === "ECONNABORTED");

    if (!isNetworkError) {
      return Promise.reject(error);
    }

    config.__isRetry = true;

    // Small delay to allow backend to fully wake
    await new Promise(resolve => setTimeout(resolve, 1500));

    return apiClient(config);
  }
);
