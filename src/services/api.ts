import axios, { type AxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_URL,
  // Shorter timeout to avoid long UI hangs when backend stalls
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    type AugmentedAxiosRequestConfig = AxiosRequestConfig & {
      __retryCount?: number;
    };
    const config = error?.config as AugmentedAxiosRequestConfig | undefined;
    if (!config) {
      const message =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      return Promise.reject(new Error(message));
    }

    // Limit retries to safe idempotent requests only
    const method = (config.method || "get").toLowerCase();
    const isIdempotent = method === "get" || method === "head";

    config.__retryCount = config.__retryCount || 0;
    const maxRetries = 1;
    const baseDelayMs = 500;

    const isNetworkOrTimeout = !error.response || error.code === "ECONNABORTED";

    if (
      isIdempotent &&
      isNetworkOrTimeout &&
      config.__retryCount < maxRetries
    ) {
      config.__retryCount += 1;
      const backoff = baseDelayMs * Math.pow(2, config.__retryCount - 1);
      await new Promise((r) => setTimeout(r, backoff));
      return apiClient(config);
    }

    const message =
      error?.response?.data?.message || error.message || "Lỗi không xác định";
    return Promise.reject(new Error(message));
  }
);
