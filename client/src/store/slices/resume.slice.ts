import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ResumeMetadata,
  ResumeParseStatus,
  ResumeUploadStatus,
} from "@/types/resume.types";

interface ResumeState {
  resume: ResumeMetadata | null;
  uploadProgress: number;
  uploadStatus: ResumeUploadStatus;
  error: string | null;
  parseStatus: ResumeParseStatus;
  parseError: string | null;
}

const initialState: ResumeState = {
  resume: null,
  uploadProgress: 0,
  uploadStatus: "idle",
  error: null,
  parseStatus: "idle",
  parseError: null,
};

const resumeSlice = createSlice({
  name: "resume",

  initialState,

  reducers: {
    setResume: (state, action: PayloadAction<ResumeMetadata | null>) => {
      state.resume = action.payload;
    },

    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },

    setUploadStatus: (state, action: PayloadAction<ResumeUploadStatus>) => {
      state.uploadStatus = action.payload;
    },

    setUploadError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetUploadState: (state) => {
      state.uploadProgress = 0;
      state.uploadStatus = "idle";
      state.error = null;
    },

    setParseStatus: (state, action: PayloadAction<ResumeParseStatus>) => {
      state.parseStatus = action.payload;
    },

    setParseError: (state, action: PayloadAction<string | null>) => {
      state.parseError = action.payload;
    },
  },
});

export const {
  setResume,
  setUploadProgress,
  setUploadStatus,
  setUploadError,
  resetUploadState,
  setParseStatus,
  setParseError,
} = resumeSlice.actions;

export default resumeSlice.reducer;
