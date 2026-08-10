"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import ContentContainer from "@/components/layout/ContentContainer";
import PageDescription from "@/components/layout/PageDescription";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import PageTitle from "@/components/layout/PageTitle";
import Skeleton from "@/components/ui/Skeleton";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import OnboardingStepper from "@/features/onboarding/components/OnboardingStepper";
import resumeService from "@/services/resume.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setResume } from "@/store/slices/resume.slice";
import AchievementsSection from "../components/review/AchievementsSection";
import CertificationsSection from "../components/review/CertificationsSection";
import EducationSection from "../components/review/EducationSection";
import ExperienceSection from "../components/review/ExperienceSection";
import PersonalInfoSection from "../components/review/PersonalInfoSection";
import ProjectsSection from "../components/review/ProjectsSection";
import ResumeSummaryCard from "../components/review/ResumeSummaryCard";
import SkillsSection from "../components/review/SkillsSection";
import SocialLinksSection from "../components/review/SocialLinksSection";
import { usePortfolioReview } from "../hooks/usePortfolioReview";

const NEXT_STEP_ROUTE = "/onboarding/resume/enhance";
const PREVIOUS_STEP_ROUTE = "/onboarding/resume";

export default function ReviewParsedDataPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => state.resume.resume);

  // Redux resume state isn't persisted (see store/index.ts), so a direct
  // navigation or page refresh lands here with `resume: null` even though a
  // parsed resume exists server-side - refetch it so the summary card still
  // renders after a refresh.
  useEffect(() => {
    if (resume) return;
    void resumeService.getResume().then((data) => {
      if (data) dispatch(setResume(data));
    });
  }, [resume, dispatch]);
  const {
    portfolio,
    status,
    error,
    refetch,
    updatePersonalInfo,
    addExperience,
    editExperience,
    removeExperience,
    addEducation,
    editEducation,
    removeEducation,
    addSkill,
    editSkill,
    removeSkill,
    addProject,
    editProject,
    removeProject,
    addCertification,
    editCertification,
    removeCertification,
    addAchievement,
    editAchievement,
    removeAchievement,
    addSocialLink,
    editSocialLink,
    removeSocialLink,
  } = usePortfolioReview();

  const hasPortfolio = status === "success" && Boolean(portfolio);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-24 lg:pb-16">
        <PageHeader />

        <ContentContainer className="pt-6 sm:pt-8">
          <OnboardingStepper currentStep={2} />

          <PageSection spacing="supporting">
            <Sparkles size={22} className="text-primary" aria-hidden="true" />
            <PageTitle className="mt-3 text-2xl sm:text-3xl">Review Your Portfolio Data</PageTitle>
            <PageDescription>
              We&apos;ve extracted information from your resume using AI. Please review
              everything before generating your portfolio.
            </PageDescription>
          </PageSection>

          <PageSection spacing="supporting" className="space-y-5 pb-6">
            {status === "loading" && (
              <>
                <Skeleton className="h-24 w-full rounded-2xl" />
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-2xl" />
                ))}
              </>
            )}

            {status === "error" && (
              <div className="rounded-2xl border border-danger/30 bg-danger/5 p-8 text-center">
                <p className="text-sm text-danger">{error}</p>
                <Button variant="secondary" className="mt-4" onClick={() => void refetch()}>
                  Try Again
                </Button>
              </div>
            )}

            {status === "success" && !portfolio && (
              <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
                <p className="text-sm text-textMuted">
                  We couldn&apos;t find any parsed portfolio data yet. Upload and parse a
                  resume first.
                </p>
                <Button className="mt-4" onClick={() => router.push(PREVIOUS_STEP_ROUTE)}>
                  Upload a Resume
                </Button>
              </div>
            )}

            {hasPortfolio && portfolio && (
              <>
                {resume && (
                  <ResumeSummaryCard
                    resume={resume}
                    skillsCount={portfolio.skills.length}
                    projectsCount={portfolio.projects.length}
                  />
                )}

                <PersonalInfoSection
                  personalInfo={portfolio.personalInfo}
                  onSave={updatePersonalInfo}
                />
                <ExperienceSection
                  experiences={portfolio.experiences}
                  onAdd={addExperience}
                  onEdit={editExperience}
                  onRemove={removeExperience}
                />
                <EducationSection
                  educations={portfolio.educations}
                  onAdd={addEducation}
                  onEdit={editEducation}
                  onRemove={removeEducation}
                />
                <SkillsSection
                  skills={portfolio.skills}
                  onAdd={addSkill}
                  onEdit={editSkill}
                  onRemove={removeSkill}
                />
                <ProjectsSection
                  projects={portfolio.projects}
                  onAdd={addProject}
                  onEdit={editProject}
                  onRemove={removeProject}
                />
                <CertificationsSection
                  certifications={portfolio.certifications}
                  onAdd={addCertification}
                  onEdit={editCertification}
                  onRemove={removeCertification}
                />
                <AchievementsSection
                  achievements={portfolio.achievements}
                  onAdd={addAchievement}
                  onEdit={editAchievement}
                  onRemove={removeAchievement}
                />
                <SocialLinksSection
                  socialLinks={portfolio.socialLinks}
                  onAdd={addSocialLink}
                  onEdit={editSocialLink}
                  onRemove={removeSocialLink}
                />
              </>
            )}
          </PageSection>

          {hasPortfolio && (
            <div className="hidden items-center justify-between border-t border-border pt-6 lg:flex">
              <Button variant="secondary" onClick={() => router.push(PREVIOUS_STEP_ROUTE)}>
                <ArrowLeft size={16} aria-hidden="true" />
                Back
              </Button>
              <div className="flex items-center gap-4">
                <p className="text-sm text-textMuted">
                  Data looks correct? Let&apos;s enhance your content.
                </p>
                <Button onClick={() => router.push(NEXT_STEP_ROUTE)}>
                  Continue
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </ContentContainer>

        {hasPortfolio && (
          <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-surface p-4 lg:hidden">
            <Button
              variant="secondary"
              onClick={() => router.push(PREVIOUS_STEP_ROUTE)}
              aria-label="Back"
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </Button>
            <Button fullWidth onClick={() => router.push(NEXT_STEP_ROUTE)}>
              Continue
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
