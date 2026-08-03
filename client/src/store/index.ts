import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth.slice";
import resumeReducer from "./slices/resume.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
