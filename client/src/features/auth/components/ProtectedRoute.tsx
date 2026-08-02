"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Wrap pages that require authentication (Dashboard, Portfolio, Settings,
// Templates). Access tokens live only in memory (Redux), so this client-side
// check - gated on AuthProvider's startup refresh - is what actually
// enforces the boundary; there is no server-readable session cookie for
// Next.js middleware to check against a cross-origin API.
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size={28} className="text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
