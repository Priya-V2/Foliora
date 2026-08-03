import { useState } from "react";
import { useRouter } from "next/navigation";
import resumeService from "@/services/resume.service";
import { useAppDispatch } from "@/store/hooks";
import {
  setResume,
  setUploadError,
  setUploadProgress,
  setUploadStatus,
} from "@/store/slices/resume.slice";
import { getErrorMessage } from "@/utils/getErrorMessage";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function validateFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload a PDF, DOC, or DOCX file.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File exceeds the maximum size of 5MB.";
  }
  return null;
}

// Drives the Upload Resume page's upload lifecycle (validate -> upload ->
// redirect to the next onboarding step). Progress/status live in Redux
// (see docs/frontend.md - shared upload state belongs there, not local
// component state) so any part of the page can reflect the same status.
export function useResumeUpload() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      dispatch(setUploadStatus("error"));
      dispatch(setUploadError(validationError));
      return;
    }

    setIsUploading(true);
    dispatch(setUploadStatus("uploading"));
    dispatch(setUploadError(null));
    dispatch(setUploadProgress(0));

    try {
      const resume = await resumeService.uploadResume(file, (percent) => {
        dispatch(setUploadProgress(percent));
      });
      dispatch(setResume(resume));
      dispatch(setUploadStatus("success"));
      setTimeout(() => router.push("/onboarding/resume/processing"), 1200);
    } catch (err) {
      dispatch(setUploadStatus("error"));
      dispatch(
        setUploadError(
          getErrorMessage(err, "Upload failed. Please try again."),
        ),
      );
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadFile, isUploading };
}
