import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user.types";
import { AuthState } from "@/types/auth.types";

// isLoading starts true: the session hasn't been resolved yet on first
// paint, so ProtectedRoute/PublicOnlyRoute must wait for the startup
// refresh (see features/auth/components/AuthProvider.tsx) before deciding
// whether to redirect.
const initialState: AuthState = {
  user: null,

  accessToken: null,

  isAuthenticated: false,

  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>,
    ) => {
      state.user = action.payload.user;

      state.accessToken = action.payload.accessToken;

      state.isAuthenticated = true;
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    clearAuth: (state) => {
      state.user = null;

      state.accessToken = null;

      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateAccessToken, setAuthLoading, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
