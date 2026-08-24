"use client";

import "@/lib/axiosInterceptor";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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

// Pages that render without an authenticated session (see the
// PublicOnlyRoute usages in features/auth/pages, plus verify-email, which
// intentionally isn't PublicOnlyRoute-gated so already-authenticated users
// can still land on it). A refresh attempt here can only fail for an
// anonymous visitor, and the interceptor's 401 handling hard-redirects to
// /login on failure - restoring the session from one of these routes would
// just redirect straight back into the same route, reloading it forever.
const PUBLIC_ONLY_ROUTES = [
  "/login",
  "/signup",
  "/reset-password",
  "/auth/verify-email",
];

// Restores the session on app startup by exchanging the HTTP-only refresh
// cookie for a new access token (see docs/security.md's refresh-token
// rotation strategy). Runs once and never blocks rendering itself -
// ProtectedRoute/PublicOnlyRoute are what wait on `isLoading`.
export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (PUBLIC_ONLY_ROUTES.includes(pathname)) {
      dispatch(setAuthLoading(false));
      return;
    }

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
  }, [dispatch, pathname]);

  return <>{children}</>;
}
