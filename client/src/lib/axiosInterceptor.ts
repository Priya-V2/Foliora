import api from "./api";
import { store } from "@/store";
import { clearAuth, updateAccessToken } from "@/store/slices/auth.slice";
import { RefreshResponse } from "@/types/auth.types";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const REFRESH_URL = "/auth/refresh";

// Login/register 401s are credential errors, not expired-token errors -
// they must never trigger a refresh attempt or redirect.
const AUTH_ENDPOINTS_WITHOUT_REFRESH = ["/auth/login", "/auth/register"];

// Shared by every concurrent 401 so simultaneous requests trigger a single
// refresh call instead of one each.
let refreshPromise: Promise<string> | null = null;

// Guards against multiple concurrent 401s each issuing their own hard
// redirect before the browser finishes navigating away.
let hasRedirectedToLogin = false;

function requestUrlIncludes(
  config: InternalAxiosRequestConfig | undefined,
  path: string,
) {
  return Boolean(config?.url?.includes(path));
}

function redirectToLogin() {
  store.dispatch(clearAuth());

  if (!hasRedirectedToLogin) {
    hasRedirectedToLogin = true;
    window.location.href = "/login";
  }
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
    const original = error.config as RetryConfig | undefined;

    if (error.response?.status !== 401 || !original) {
      return Promise.reject(error);
    }

    if (
      AUTH_ENDPOINTS_WITHOUT_REFRESH.some((path) =>
        requestUrlIncludes(original, path),
      )
    ) {
      return Promise.reject(error);
    }

    // The refresh call itself failed - there is no further token to fetch,
    // so retrying it would recurse forever. Stop immediately instead.
    if (requestUrlIncludes(original, REFRESH_URL)) {
      redirectToLogin();
      return Promise.reject(error);
    }

    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post<RefreshResponse>(REFRESH_URL)
          .then(({ data }) => {
            store.dispatch(updateAccessToken(data.accessToken));
            return data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const accessToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${accessToken}`;

      return api(original);
    } catch {
      redirectToLogin();
      return Promise.reject(error);
    }
  },
);
