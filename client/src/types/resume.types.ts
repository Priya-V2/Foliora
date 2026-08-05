export type ResumeStatus = "UPLOADED" | "PARSING" | "PARSED" | "FAILED";

export interface ResumeMetadata {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: ResumeStatus;
  uploadedAt: string;
  updatedAt: string;
}

export type ResumeUploadStatus = "idle" | "uploading" | "success" | "error";

export type ResumeParseStatus =
  | "idle"
  | "processing"
  | "success"
  | "error";
