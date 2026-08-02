import { useEffect, useRef, useState } from "react";
import authService from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

export type VerifyEmailStatus =
  | "verifying"
  | "success"
  | "failed"
  | "already-verified";

// The backend (server/src/auth/auth.service.ts#verifyEmail) currently
// returns the same "Invalid or expired verification token" message whether
// the token is garbage, expired, or was already used - it can't yet
// distinguish "already verified" from a genuinely bad link. This routes on
// the message content so the "already-verified" branch activates
// automatically once the backend starts sending a distinguishable message,
// without requiring another frontend change.
function resolveStatus(message: string): VerifyEmailStatus {
  return message.toLowerCase().includes("already")
    ? "already-verified"
    : "failed";
}

export function useVerifyEmail(token: string | null) {
  const [status, setStatus] = useState<VerifyEmailStatus>(() =>
    token ? "verifying" : "failed",
  );
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !token) return;
    hasRun.current = true;

    authService
      .verifyEmail({ token })
      .then(() => setStatus("success"))
      .catch((err) => setStatus(resolveStatus(getErrorMessage(err, ""))));
  }, [token]);

  return { status };
}
