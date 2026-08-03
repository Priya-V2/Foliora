"use client";

import { useRef, useState, type DragEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  UploadCloud,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { ResumeUploadStatus } from "@/types/resume.types";

interface ResumeDropzoneProps {
  status: ResumeUploadStatus;
  progress: number;
  fileName: string | null;
  errorMessage: string | null;
  onFileSelected: (file: File) => void;
  onRetry: () => void;
}

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx";

export default function ResumeDropzone({
  status,
  progress,
  fileName,
  errorMessage,
  onFileSelected,
  onRetry,
}: ResumeDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isInteractive = status === "idle" || status === "error";

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!isInteractive) return;

    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (isInteractive) setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);
    event.target.value = "";
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "rounded-2xl border-2 border-dashed border-primary bg-surface p-6 text-center transition-colors sm:p-8 md:p-10",
        isDragging && "bg-surfaceAlt",
        status === "error" && "border-danger",
        status === "success" && "border-success",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div aria-live="polite" className="flex flex-col items-center">
        {status === "idle" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-14 sm:w-14 md:h-16 md:w-16">
              <FileText size={28} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text sm:mt-5 sm:text-xl">
              Drag &amp; drop your resume here
            </h2>
            <p className="mt-1 text-xs text-textMuted sm:text-sm">
              Support for professional CVs and portfolios
            </p>
            <Button
              type="button"
              className="mt-4 rounded-full px-6 text-sm sm:mt-6 sm:px-8 sm:text-base"
              onClick={() => inputRef.current?.click()}
            >
              Choose File
            </Button>
            <div className="mt-4 w-full border-t border-border pt-3 sm:mt-6 sm:pt-4">
              <p className="text-xs uppercase tracking-wide text-textMuted">
                PDF, DOC, DOCX &bull; Maximum file size: 5MB
              </p>
            </div>
          </>
        )}

        {status === "uploading" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-14 sm:w-14 md:h-16 md:w-16">
              <UploadCloud size={28} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text sm:mt-5 sm:text-xl">
              Uploading your resume...
            </h2>
            {fileName && (
              <p className="mt-1 truncate text-xs text-textMuted sm:text-sm">
                {fileName}
              </p>
            )}
            <div className="mt-4 w-full max-w-xs sm:mt-6">
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Upload progress"
                className="h-2 w-full overflow-hidden rounded-full bg-border"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-textMuted">{progress}%</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success sm:h-14 sm:w-14 md:h-16 md:w-16">
              <CheckCircle2 size={28} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text sm:mt-5 sm:text-xl">
              Resume uploaded successfully.
            </h2>
            <div className="mt-3 flex items-center gap-2 text-xs text-textMuted sm:text-sm">
              <Spinner size={16} className="text-primary" />
              Redirecting...
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger sm:h-14 sm:w-14 md:h-16 md:w-16">
              <AlertCircle size={28} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text sm:mt-5 sm:text-xl">
              We couldn&apos;t upload your resume
            </h2>
            <p role="alert" className="mt-1 text-xs text-danger sm:text-sm">
              {errorMessage ?? "Something went wrong. Please try again."}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4 sm:mt-6"
              onClick={() => {
                onRetry();
                inputRef.current?.click();
              }}
            >
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
