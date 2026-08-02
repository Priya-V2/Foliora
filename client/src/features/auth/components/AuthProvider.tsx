"use client";

import "@/lib/axiosInterceptor";
import { useEffect, useRef } from "react";
import authService from "@/services/auth.service";
import { useAppDispatch } from "@/store/hooks";
import {
  clearAuth,
  setAuthLoading,
  setCredentials,
  updateAccessToken,
} from "@/store/slices/auth.slice";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Restores the session on app startup by exchanging the HTTP-only refresh
// cookie for a new access token (see docs/security.md's refresh-token
// rotation strategy). Runs once and never blocks rendering itself -
// ProtectedRoute/PublicOnlyRoute are what wait on `isLoading`.
export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function restoreSession() {
      try {
        const { accessToken } = await authService.refresh();
        // Dispatched before getCurrentUser() so the request interceptor
        // attaches it - otherwise the /me call would 401 and trigger a
        // second, redundant refresh via the response interceptor.
        dispatch(updateAccessToken(accessToken));
        const user = await authService.getCurrentUser();
        dispatch(setCredentials({ user, accessToken }));
      } catch {
        dispatch(clearAuth());
      } finally {
        dispatch(setAuthLoading(false));
      }
    }

    void restoreSession();
  }, [dispatch]);

  return <>{children}</>;
}
