import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user.types";
import { AuthState } from "@/types/auth.types";

const initialState: AuthState = {
  user: null,

  accessToken: null,

  isAuthenticated: false,

  isLoading: false,
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

    clearAuth: (state) => {
      state.user = null;

      state.accessToken = null;

      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateAccessToken, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
