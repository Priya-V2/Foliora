import { registerAs } from '@nestjs/config';

// Centralized resume upload/storage configuration, mirroring the pattern in
// auth.config.ts and mail.config.ts. Only LOCAL storage is configured today;
// a future CLOUDINARY provider would add its own settings here without
// touching ResumeModule or ResumeService.
export default registerAs('resume', () => ({
  uploadDir: process.env.RESUME_UPLOAD_DIR ?? './uploads/resumes',
  maxFileSizeMb: Number(process.env.RESUME_MAX_FILE_SIZE_MB ?? 5),
}));
