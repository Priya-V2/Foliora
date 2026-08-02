import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth.slice";
import { LoginRequest } from "@/types/auth.types";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function login(values: LoginRequest) {
    setError(null);
    try {
      const { accessToken, user } = await authService.login(values);
      dispatch(setCredentials({ user, accessToken }));
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to log in. Please try again."));
      throw err;
    }
  }

  return { login, error, clearError: () => setError(null) };
}
