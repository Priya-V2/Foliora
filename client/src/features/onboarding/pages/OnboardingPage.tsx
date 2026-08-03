import { FileText, Lightbulb, PenLine } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import PageSection from "@/components/layout/PageSection";
import PageTitle from "@/components/layout/PageTitle";
import PageDescription from "@/components/layout/PageDescription";
import SectionContainer from "@/components/layout/SectionContainer";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import OnboardingOptionCard from "../components/OnboardingOptionCard";

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <PageLayout header={<PageHeader />}>
        <SectionContainer width="narrow" className="text-center">
          <PageTitle>Let&apos;s build your portfolio.</PageTitle>
          <PageDescription>
            Choose how you&apos;d like to get started. You can combine methods
            later, so you&apos;re never locked into one approach.
          </PageDescription>
        </SectionContainer>

        <PageSection spacing="primary">
          <SectionContainer>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8">
              <OnboardingOptionCard
                icon={FileText}
                title="Upload Resume"
                subtitle="Fastest setup • 2–3 min"
                features={[
                  "Experience & Education",
                  "Skills & Certifications",
                  "Contact Details",
                ]}
                helperText="GitHub projects can be imported afterwards."
                ctaLabel="Upload Resume"
                href="/onboarding/resume"
                recommended
                variant="primary"
              />

              <OnboardingOptionCard
                icon={PenLine}
                title="Start from Scratch"
                subtitle="Complete control"
                features={[
                  "Full customization",
                  "No imports required",
                  "Add everything manually",
                ]}
                helperText="Perfect if you're just getting started."
                ctaLabel="Start Building"
                href="/onboarding/manual"
                variant="ghost"
              />
            </div>
          </SectionContainer>
        </PageSection>

        <PageSection spacing="supporting">
          <SectionContainer>
            <div className="flex items-start gap-3 rounded-2xl bg-surfaceAlt p-4 sm:gap-4 sm:p-6 md:p-8">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-10 sm:w-10">
                <Lightbulb size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text sm:text-base">
                  You can always change this later.
                </p>
                <p className="mt-1 text-xs text-textMuted sm:text-sm">
                  You can import your resume, connect GitHub, or edit everything
                  manually later. You&apos;re never locked into one setup
                  method. Foliora is designed to grow with your career.
                </p>
              </div>
            </div>
          </SectionContainer>
        </PageSection>
      </PageLayout>
    </ProtectedRoute>
  );
}
