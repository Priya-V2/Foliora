"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { AuthCard, AuthCardHeader } from "@/features/auth/components/AuthCard";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { useLogout } from "@/features/auth/hooks/useLogout";
import authService from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

// Temporary authentication test dashboard. Exists only to validate the
// end-to-end JWT flow (protected routes, interceptor, refresh rotation,
// logout) from the browser. Remove this feature once the real dashboard
// (per docs/frontend.md's `features/dashboard`) is implemented.
function DashboardCard() {
  const [isPinging, setIsPinging] = useState(false);
  const { logout, isLoading: isLoggingOut } = useLogout();

  async function handlePing() {
    setIsPinging(true);
    try {
      const { message } = await authService.ping();
      toast.success(`${message}`);
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Unable to reach the protected endpoint."),
      );
    } finally {
      setIsPinging(false);
    }
  }

  return (
    <AuthCard className="text-center">
      <AuthCardHeader
        title="Authentication Test Dashboard"
        subtitle="This page exists only to verify authentication."
      />

      <div className="flex flex-col gap-3">
        <Button onClick={handlePing} isLoading={isPinging} fullWidth>
          Click Me
        </Button>
        <Button
          variant="secondary"
          onClick={logout}
          isLoading={isLoggingOut}
          fullWidth
        >
          Logout
        </Button>
      </div>
    </AuthCard>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <DashboardCard />
      </div>
    </ProtectedRoute>
  );
}
