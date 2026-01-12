import { API_URL } from "@config/env";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { waitForReady } from "@services/HealthService";

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

    // Method safety: only automatically retry idempotent requests
    const method = (config.method || "get").toLowerCase();
    const isIdempotent = ["get", "head", "options"].includes(method);

    // Cold-start / wake-up signatures
    const isNetworkError =
      !error.response &&
      (error.message === "Network Error" || error.code === "ECONNABORTED");

    // Treat server 5xx as possible wake-up state for idempotent calls
    const isServerError = !!error.response && error.response.status >= 500 && error.response.status < 600;

    // Only retry automatically for idempotent requests when we suspect a cold-start
    if (!isIdempotent || !(isNetworkError || isServerError)) {
      return Promise.reject(error);
    }

    // mark as retrying so we don't loop forever
    config.__isRetry = true;

    // Use a shared health wait so concurrent requests don't start their own probes.
    try {
      await waitForReady();
      return apiClient(config);
    } catch (waitErr) {
      return Promise.reject(error);
    }
  }
);
