import { isAxiosError } from "axios";

/**
 * Extracts a user-safe message from a NestJS error response
 * (`{ statusCode, message, error }`), falling back to a generic message so
 * internal details never leak to the UI.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const { message } = error.response?.data ?? {};
    if (Array.isArray(message)) return message[0] ?? fallback;
    if (message) return message;
  }
  return fallback;
}
