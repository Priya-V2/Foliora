"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageDescription from "@/components/layout/PageDescription";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import PageSection from "@/components/layout/PageSection";
import PageTitle from "@/components/layout/PageTitle";
import SectionContainer from "@/components/layout/SectionContainer";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import GithubConnectPanel from "../components/GithubConnectPanel";
import GithubImportInfo from "../components/GithubImportInfo";
import GithubPrivacyNote from "../components/GithubPrivacyNote";
import RepositoryList from "../components/RepositoryList";
import { useGithubConnection } from "../hooks/useGithubConnection";

const PREVIOUS_STEP_ROUTE = "/onboarding/resume/review";

export default function ConnectGithubPage() {
  const router = useRouter();
  const {
    connectionStatus,
    profile,
    connectionError,
    isConnecting,
    connectGithub,
    retryConnection,
    repositories,
    repositoriesStatus,
    repositoriesError,
    refetchRepositories,
    selectedRepoIds,
    toggleRepository,
    isContinuing,
    continueOnboarding,
    skip,
  } = useGithubConnection();

  const isReady = connectionStatus !== "loading";

  return (
    <ProtectedRoute>
      {/* Explicit pb override at every breakpoint so it reliably beats
          PageLayout's own responsive py-* - reserves clearance for the fixed
          mobile/tablet action bar below `lg`, matching ReviewParsedDataPage. */}
      <PageLayout
        header={<PageHeader stepNumber={3} />}
        className="pb-24 sm:pb-24 md:pb-24 lg:pb-16"
      >
        <PageSection spacing="supporting" className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-primary" aria-hidden="true" />
            <PageTitle className="text-xl lg:text-2xl">
              Import from GitHub
            </PageTitle>
            <Badge variant="neutral">Optional</Badge>
          </div>
          <PageDescription className="mx-auto max-w-xl">
            Your portfolio draft is already ready. Connect GitHub to import
            projects from your public repositories.
          </PageDescription>
        </PageSection>

        <PageSection spacing="supporting" className="space-y-5 pb-6">
          <SectionContainer width="default">
            <Card className="space-y-5">
              <GithubConnectPanel
                status={connectionStatus}
                profile={profile}
                error={connectionError}
                isConnecting={isConnecting}
                onConnect={connectGithub}
                onRetry={retryConnection}
                onSkip={skip}
              />

              {connectionStatus === "connected" && (
                <RepositoryList
                  status={repositoriesStatus}
                  repositories={repositories}
                  error={repositoriesError}
                  selectedRepoIds={selectedRepoIds}
                  onToggle={toggleRepository}
                  onRetry={refetchRepositories}
                />
              )}
            </Card>

            <Card className="mt-5">
              <GithubImportInfo />
            </Card>

            <div className="mt-5">
              <GithubPrivacyNote />
            </div>
          </SectionContainer>
        </PageSection>

        {isReady && (
          <div className="hidden items-center justify-between border-t border-border pt-6 lg:flex">
            <Button
              variant="secondary"
              onClick={() => router.push(PREVIOUS_STEP_ROUTE)}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <p className="text-sm text-textMuted">
                You can connect GitHub later from Settings.
              </p>
              <Button onClick={() => void continueOnboarding()} isLoading={isContinuing}>
                {isContinuing ? "Saving..." : "Continue"}
                {!isContinuing && <ArrowRight size={16} aria-hidden="true" />}
              </Button>
            </div>
          </div>
        )}
      </PageLayout>

      {isReady && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-surface p-4 lg:hidden">
          <Button
            variant="secondary"
            onClick={() => router.push(PREVIOUS_STEP_ROUTE)}
            aria-label="Back"
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </Button>
          <Button
            fullWidth
            onClick={() => void continueOnboarding()}
            isLoading={isContinuing}
          >
            {isContinuing ? "Saving..." : "Continue"}
            {!isContinuing && <ArrowRight size={16} aria-hidden="true" />}
          </Button>
        </div>
      )}
    </ProtectedRoute>
  );
}
