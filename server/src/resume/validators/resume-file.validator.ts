// Canonical list of MIME types accepted for resume uploads (see docs/product
// requirements: PDF, DOC, DOCX). Kept here as the single source of truth so
// both the Multer fileFilter (resume.module.ts) and any future
// server-side/client-side check stay in sync.
export const ALLOWED_RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export type AllowedResumeMimeType = (typeof ALLOWED_RESUME_MIME_TYPES)[number];

export function isAllowedResumeMimeType(
  mimetype: string,
): mimetype is AllowedResumeMimeType {
  return (ALLOWED_RESUME_MIME_TYPES as readonly string[]).includes(mimetype);
}
