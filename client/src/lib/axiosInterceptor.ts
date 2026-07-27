import api from "./api";
import { store } from "@/store";
import { clearAuth, updateAccessToken } from "@/store/slices/auth.slice";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as RetryConfig;

    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;

      try {
        const response = await api.post("/auth/refresh");

        store.dispatch(updateAccessToken(response.data.accessToken));

        original.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return api(original);
      } catch {
        store.dispatch(clearAuth());

        window.location.href = "/login";

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
