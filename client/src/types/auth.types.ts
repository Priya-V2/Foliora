import { User } from "./user.types";

export interface AuthState {
  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;
}
