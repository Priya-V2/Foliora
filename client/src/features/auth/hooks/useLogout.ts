import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth } from "@/store/slices/auth.slice";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    setIsLoading(true);
    try {
      const { message } = await authService.logout();
      toast.success(message);
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to log out. Please try again."));
    } finally {
      dispatch(clearAuth());
      setIsLoading(false);
      router.push("/login");
    }
  }

  return { logout, isLoading };
}
