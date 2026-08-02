import api from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  VerifyEmailRequest,
} from "@/types/auth.types";
import { User } from "@/types/user.types";

async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);
  return data;
}

async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}

async function logout(): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>("/auth/logout");
  return data;
}

async function refresh(): Promise<RefreshResponse> {
  const { data } = await api.post<RefreshResponse>("/auth/refresh");
  return data;
}

async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

// Temporary: backs the auth test dashboard (features/dashboard). Verifies a
// protected request travels through the interceptor's auth + refresh flow.
async function ping(): Promise<MessageResponse> {
  const { data } = await api.get<MessageResponse>("/auth/ping");
  return data;
}

async function verifyEmail(
  payload: VerifyEmailRequest,
): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>(
    "/auth/verify-email",
    payload,
  );
  return data;
}

async function resendVerification(
  payload: ResendVerificationRequest,
): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>(
    "/auth/resend-verification",
    payload,
  );
  return data;
}

const authService = {
  register,
  login,
  logout,
  refresh,
  getCurrentUser,
  verifyEmail,
  resendVerification,
  ping,
};

export default authService;
