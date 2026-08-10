"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import portfolioService from "@/services/portfolio.service";
import {
  AchievementInput,
  CertificationInput,
  EducationInput,
  ExperienceInput,
  Portfolio,
  ProjectInput,
  SkillInput,
  SocialLinkInput,
  UpdatePersonalInfoInput,
} from "@/types/portfolio.types";
import { getErrorMessage } from "@/utils/getErrorMessage";

type PortfolioLoadStatus = "loading" | "success" | "error";

// Wraps a single section CRUD call with the app's standard success/error
// toast feedback (see docs/ui-guidelines.md "Success Feedback" / "Error
// States"), then rethrows on failure so the calling edit form can keep
// itself open instead of silently closing on a rejected save.
async function runMutation<T>(action: () => Promise<T>, successMessage: string): Promise<T> {
  try {
    const result = await action();
    toast.success(successMessage);
    return result;
  } catch (error) {
    toast.error(getErrorMessage(error, "Something went wrong. Please try again."));
    throw error;
  }
}

// Owns the Review Parsed Data screen's portfolio state: fetch-on-mount plus
// one add/edit/remove pair per section, each of which persists via
// portfolioService and then reconciles local state from the server's
// response (see docs "Save Strategy": submit -> backend validates -> persist
// -> return updated record -> update UI). Page-local state rather than
// Redux, since no other screen currently reads this data (see
// docs/ui-guidelines.md "local state for component-specific concerns").
export function usePortfolioReview() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [status, setStatus] = useState<PortfolioLoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await portfolioService.getPortfolio();
      setPortfolio(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(getErrorMessage(err, "We couldn't load your portfolio data."));
    }
  }, []);

  useEffect(() => {
    // Deferred via setTimeout so the initial setState calls inside
    // fetchPortfolio() happen outside the effect's synchronous body (avoids
    // cascading renders on mount - see react-hooks/set-state-in-effect,
    // same pattern as useResumeParsing.ts).
    const timeoutId = setTimeout(() => {
      void fetchPortfolio();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchPortfolio]);

  const updatePersonalInfo = useCallback(async (input: UpdatePersonalInfoInput) => {
    const personalInfo = await runMutation(
      () => portfolioService.updatePersonalInfo(input),
      "Personal information updated",
    );
    setPortfolio((prev) => (prev ? { ...prev, personalInfo } : prev));
  }, []);

  const addExperience = useCallback(async (input: ExperienceInput) => {
    const experience = await runMutation(
      () => portfolioService.createExperience(input),
      "Experience added",
    );
    setPortfolio((prev) =>
      prev ? { ...prev, experiences: [...prev.experiences, experience] } : prev,
    );
  }, []);

  const editExperience = useCallback(async (id: string, input: Partial<ExperienceInput>) => {
    const experience = await runMutation(
      () => portfolioService.updateExperience(id, input),
      "Experience updated",
    );
    setPortfolio((prev) =>
      prev
        ? {
            ...prev,
            experiences: prev.experiences.map((item) => (item.id === id ? experience : item)),
          }
        : prev,
    );
  }, []);

  const removeExperience = useCallback(async (id: string) => {
    await runMutation(() => portfolioService.deleteExperience(id), "Experience removed");
    setPortfolio((prev) =>
      prev ? { ...prev, experiences: prev.experiences.filter((item) => item.id !== id) } : prev,
    );
  }, []);

  const addEducation = useCallback(async (input: EducationInput) => {
    const education = await runMutation(
      () => portfolioService.createEducation(input),
      "Education added",
    );
    setPortfolio((prev) =>
      prev ? { ...prev, educations: [...prev.educations, education] } : prev,
    );
  }, []);

  const editEducation = useCallback(async (id: string, input: Partial<EducationInput>) => {
    const education = await runMutation(
      () => portfolioService.updateEducation(id, input),
      "Education updated",
    );
    setPortfolio((prev) =>
      prev
        ? {
            ...prev,
            educations: prev.educations.map((item) => (item.id === id ? education : item)),
          }
        : prev,
    );
  }, []);

  const removeEducation = useCallback(async (id: string) => {
    await runMutation(() => portfolioService.deleteEducation(id), "Education removed");
    setPortfolio((prev) =>
      prev ? { ...prev, educations: prev.educations.filter((item) => item.id !== id) } : prev,
    );
  }, []);

  const addSkill = useCallback(async (input: SkillInput) => {
    const skill = await runMutation(() => portfolioService.createSkill(input), "Skill added");
    setPortfolio((prev) => (prev ? { ...prev, skills: [...prev.skills, skill] } : prev));
  }, []);

  const editSkill = useCallback(async (id: string, input: Partial<SkillInput>) => {
    const skill = await runMutation(
      () => portfolioService.updateSkill(id, input),
      "Skill updated",
    );
    setPortfolio((prev) =>
      prev
        ? { ...prev, skills: prev.skills.map((item) => (item.id === id ? skill : item)) }
        : prev,
    );
  }, []);

  const removeSkill = useCallback(async (id: string) => {
    await runMutation(() => portfolioService.deleteSkill(id), "Skill removed");
    setPortfolio((prev) =>
      prev ? { ...prev, skills: prev.skills.filter((item) => item.id !== id) } : prev,
    );
  }, []);

  const addProject = useCallback(async (input: ProjectInput) => {
    const project = await runMutation(
      () => portfolioService.createProject(input),
      "Project added",
    );
    setPortfolio((prev) => (prev ? { ...prev, projects: [...prev.projects, project] } : prev));
  }, []);

  const editProject = useCallback(async (id: string, input: Partial<ProjectInput>) => {
    const project = await runMutation(
      () => portfolioService.updateProject(id, input),
      "Project updated",
    );
    setPortfolio((prev) =>
      prev
        ? { ...prev, projects: prev.projects.map((item) => (item.id === id ? project : item)) }
        : prev,
    );
  }, []);

  const removeProject = useCallback(async (id: string) => {
    await runMutation(() => portfolioService.deleteProject(id), "Project removed");
    setPortfolio((prev) =>
      prev ? { ...prev, projects: prev.projects.filter((item) => item.id !== id) } : prev,
    );
  }, []);

  const addCertification = useCallback(async (input: CertificationInput) => {
    const certification = await runMutation(
      () => portfolioService.createCertification(input),
      "Certification added",
    );
    setPortfolio((prev) =>
      prev ? { ...prev, certifications: [...prev.certifications, certification] } : prev,
    );
  }, []);

  const editCertification = useCallback(
    async (id: string, input: Partial<CertificationInput>) => {
      const certification = await runMutation(
        () => portfolioService.updateCertification(id, input),
        "Certification updated",
      );
      setPortfolio((prev) =>
        prev
          ? {
              ...prev,
              certifications: prev.certifications.map((item) =>
                item.id === id ? certification : item,
              ),
            }
          : prev,
      );
    },
    [],
  );

  const removeCertification = useCallback(async (id: string) => {
    await runMutation(() => portfolioService.deleteCertification(id), "Certification removed");
    setPortfolio((prev) =>
      prev
        ? { ...prev, certifications: prev.certifications.filter((item) => item.id !== id) }
        : prev,
    );
  }, []);

  const addAchievement = useCallback(async (input: AchievementInput) => {
    const achievement = await runMutation(
      () => portfolioService.createAchievement(input),
      "Achievement added",
    );
    setPortfolio((prev) =>
      prev ? { ...prev, achievements: [...prev.achievements, achievement] } : prev,
    );
  }, []);

  const editAchievement = useCallback(async (id: string, input: Partial<AchievementInput>) => {
    const achievement = await runMutation(
      () => portfolioService.updateAchievement(id, input),
      "Achievement updated",
    );
    setPortfolio((prev) =>
      prev
        ? {
            ...prev,
            achievements: prev.achievements.map((item) => (item.id === id ? achievement : item)),
          }
        : prev,
    );
  }, []);

  const removeAchievement = useCallback(async (id: string) => {
    await runMutation(() => portfolioService.deleteAchievement(id), "Achievement removed");
    setPortfolio((prev) =>
      prev
        ? { ...prev, achievements: prev.achievements.filter((item) => item.id !== id) }
        : prev,
    );
  }, []);

  const addSocialLink = useCallback(async (input: SocialLinkInput) => {
    const socialLink = await runMutation(
      () => portfolioService.createSocialLink(input),
      "Social link added",
    );
    setPortfolio((prev) =>
      prev ? { ...prev, socialLinks: [...prev.socialLinks, socialLink] } : prev,
    );
  }, []);

  const editSocialLink = useCallback(async (id: string, input: Partial<SocialLinkInput>) => {
    const socialLink = await runMutation(
      () => portfolioService.updateSocialLink(id, input),
      "Social link updated",
    );
    setPortfolio((prev) =>
      prev
        ? {
            ...prev,
            socialLinks: prev.socialLinks.map((item) => (item.id === id ? socialLink : item)),
          }
        : prev,
    );
  }, []);

  const removeSocialLink = useCallback(async (id: string) => {
    await runMutation(() => portfolioService.deleteSocialLink(id), "Social link removed");
    setPortfolio((prev) =>
      prev
        ? { ...prev, socialLinks: prev.socialLinks.filter((item) => item.id !== id) }
        : prev,
    );
  }, []);

  return {
    portfolio,
    status,
    error,
    refetch: fetchPortfolio,
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
  };
}
