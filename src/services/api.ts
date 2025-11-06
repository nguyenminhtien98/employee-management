import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error?.config;
    if (!config) {
      const message =
        error?.response?.data?.message || error.message || "Lỗi không xác định";
      return Promise.reject(new Error(message));
    }

    config.__retryCount = config.__retryCount || 0;
    const maxRetries = 2;
    const retryDelayMs = 1000;

    if (
      config.__retryCount < maxRetries &&
      (!error.response || error.code === "ECONNABORTED")
    ) {
      config.__retryCount += 1;
      await new Promise((r) => setTimeout(r, retryDelayMs));
      return apiClient(config);
    }

    const message =
      error?.response?.data?.message || error.message || "Lỗi không xác định";
    return Promise.reject(new Error(message));
  }
);
