import { useState } from "react";
import authService from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth.types";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useRegister() {
  const [error, setError] = useState<string | null>(null);

  async function register(values: RegisterRequest) {
    setError(null);
    try {
      return await authService.register(values);
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to create your account. Please try again."),
      );
      throw err;
    }
  }

  return { register, error, clearError: () => setError(null) };
}
