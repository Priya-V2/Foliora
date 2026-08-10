"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert, Loader2, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { PROCESSING_STAGES, useResumeParsing } from "../hooks/useResumeParsing";

export default function ResumeProcessingScreen() {
  const router = useRouter();
  const { stageIndex, status, error, retry } = useResumeParsing();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary"
          >
            Foliora
          </Link>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            {status === "error" ? (
              <CircleAlert size={28} className="text-danger" />
            ) : status === "success" ? (
              <CheckCircle2 size={28} />
            ) : (
              <Sparkles size={28} />
            )}
          </div>

          {status === "error" ? (
            <>
              <h1 className="mt-6 text-2xl font-bold text-text">
                Resume parsing failed
              </h1>
              <p className="mt-2 max-w-md text-sm text-textMuted">
                {error ?? "Something went wrong while processing your resume."}
              </p>
              <Button className="mt-8" onClick={retry}>
                Retry Parsing
              </Button>
            </>
          ) : status === "success" ? (
            <>
              <h1 className="mt-6 text-2xl font-bold text-text">
                Your portfolio is ready
              </h1>
              <p className="mt-2 max-w-md text-sm text-textMuted">
                We&apos;ve extracted your experience, education, and skills
                from your resume. Review it before continuing.
              </p>
              <Button className="mt-8" onClick={() => router.push("/onboarding/resume/review")}>
                Review Your Data
              </Button>
            </>
          ) : (
            <>
              <h1 className="mt-6 text-2xl font-bold text-text">
                Processing your resume
              </h1>
              <p className="mt-2 max-w-md text-sm text-textMuted">
                This usually takes less than a minute. Please don&apos;t close
                this page.
              </p>
            </>
          )}

          {status === "processing" && (
            <ol
              className="mt-8 flex flex-col items-start gap-3 text-left"
              role="status"
              aria-live="polite"
            >
              {PROCESSING_STAGES.map((stage, index) => {
                const isDone = index < stageIndex;
                const isCurrent = index === stageIndex;

                return (
                  <li
                    key={stage}
                    className="flex items-center gap-2 text-sm"
                  >
                    {isDone ? (
                      <CheckCircle2
                        size={16}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    ) : isCurrent ? (
                      <Loader2
                        size={16}
                        className="animate-spin text-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className="h-4 w-4 rounded-full border border-border"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={
                        isDone || isCurrent ? "text-text" : "text-textMuted"
                      }
                    >
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}

          <Link
            href="/dashboard"
            className="mt-8 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Go to Dashboard
          </Link>
        </main>
      </div>
    </ProtectedRoute>
  );
}
