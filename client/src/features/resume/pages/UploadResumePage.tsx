"use client";

import { useEffect } from "react";
import { Lock } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import PageSection from "@/components/layout/PageSection";
import PageTitle from "@/components/layout/PageTitle";
import PageDescription from "@/components/layout/PageDescription";
import SectionContainer from "@/components/layout/SectionContainer";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import ResumeDropzone from "../components/ResumeDropzone";
import { useResumeUpload } from "../hooks/useResumeUpload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetUploadState } from "@/store/slices/resume.slice";

function UploadResumeCard() {
  const dispatch = useAppDispatch();
  const { uploadFile } = useResumeUpload();
  const { uploadStatus, uploadProgress, error, resume } = useAppSelector(
    (state) => state.resume,
  );

  useEffect(() => {
    return () => {
      dispatch(resetUploadState());
    };
  }, [dispatch]);

  return (
    <PageLayout header={<PageHeader />}>
      <SectionContainer width="narrow">
        <div className="mt-3 sm:mt-4">
          <PageTitle>Upload your resume</PageTitle>
          <PageDescription>
            We&apos;ll securely store your resume so you can build your
            portfolio from it. You&apos;ll review everything before anything is
            published.
          </PageDescription>
        </div>

        <PageSection spacing="supporting">
          <ResumeDropzone
            status={uploadStatus}
            progress={uploadProgress}
            fileName={resume?.fileName ?? null}
            errorMessage={error}
            onFileSelected={uploadFile}
            onRetry={() => dispatch(resetUploadState())}
          />
        </PageSection>

        <PageSection spacing="supporting">
          <div className="flex items-start gap-3 rounded-2xl bg-surfaceAlt p-4 sm:gap-4 sm:p-6 md:p-8">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success sm:h-10 sm:w-10">
              <Lock size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text sm:text-base">
                Your data stays under your control.
              </p>
              <p className="mt-1 text-xs text-textMuted sm:text-sm">
                Your resume is stored securely and only accessible to you.
                Nothing is published automatically. You&apos;ll review and edit
                everything before creating your portfolio.
              </p>
            </div>
          </div>
        </PageSection>
      </SectionContainer>
    </PageLayout>
  );
}

export default function UploadResumePage() {
  return (
    <ProtectedRoute>
      <UploadResumeCard />
    </ProtectedRoute>
  );
}
