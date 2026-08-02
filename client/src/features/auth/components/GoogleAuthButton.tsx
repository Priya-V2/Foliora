"use client";

import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import Button from "@/components/ui/Button";

// Google OAuth has no backend implementation yet (no strategy/controller
// under server/src/auth) - this stays a visual affordance until that lands.
export default function GoogleAuthButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      onClick={() => toast.info("Google sign-in is coming soon.")}
    >
      <FcGoogle size={18} />
      Continue with Google
    </Button>
  );
}
