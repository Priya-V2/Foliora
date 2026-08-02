import { useState } from "react";
import authService from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useResendVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resend(email: string) {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resendVerification({ email });
      setIsSent(true);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to resend the email right now."));
    } finally {
      setIsLoading(false);
    }
  }

  return { resend, isLoading, isSent, error };
}
