"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { useAppSelector } from "@/store/hooks";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

// Wrap pages authenticated users shouldn't see (Login, Register, Forgot
// Password) and redirect them to the Dashboard instead.
export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size={28} className="text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
