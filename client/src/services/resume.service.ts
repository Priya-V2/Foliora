import api from "@/lib/api";
import { ResumeMetadata } from "@/types/resume.types";

async function getResume(): Promise<ResumeMetadata | null> {
  const { data } = await api.get<ResumeMetadata | null>("/resume");
  return data;
}

async function uploadResume(
  file: File,
  onUploadProgress?: (percent: number) => void,
): Promise<ResumeMetadata> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ResumeMetadata>(
    "/resume/upload",
    formData,
    {
      onUploadProgress: (event) => {
        if (!onUploadProgress || !event.total) return;
        onUploadProgress(Math.round((event.loaded / event.total) * 100));
      },
    },
  );

  return data;
}

async function deleteResume(): Promise<void> {
  await api.delete("/resume");
}

const resumeService = {
  getResume,
  uploadResume,
  deleteResume,
};

export default resumeService;
