import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Spinner size={28} className="text-primary" />
        </div>
      }
    >
      <VerifyEmailPage />
    </Suspense>
  );
}
