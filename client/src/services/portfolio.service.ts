import api from "@/lib/api";
import {
  Achievement,
  AchievementInput,
  Certification,
  CertificationInput,
  Education,
  EducationInput,
  Experience,
  ExperienceInput,
  PersonalInfo,
  Portfolio,
  Project,
  ProjectInput,
  Skill,
  SkillInput,
  SocialLink,
  SocialLinkInput,
  UpdatePersonalInfoInput,
} from "@/types/portfolio.types";

async function getPortfolio(): Promise<Portfolio | null> {
  const { data } = await api.get<Portfolio | null>("/portfolio");
  return data;
}

async function updatePersonalInfo(
  input: UpdatePersonalInfoInput,
): Promise<PersonalInfo> {
  const { data } = await api.patch<PersonalInfo>("/portfolio/personal-info", input);
  return data;
}

async function createExperience(input: ExperienceInput): Promise<Experience> {
  const { data } = await api.post<Experience>("/portfolio/experiences", input);
  return data;
}

async function updateExperience(
  id: string,
  input: Partial<ExperienceInput>,
): Promise<Experience> {
  const { data } = await api.patch<Experience>(`/portfolio/experiences/${id}`, input);
  return data;
}

async function deleteExperience(id: string): Promise<void> {
  await api.delete(`/portfolio/experiences/${id}`);
}

async function createEducation(input: EducationInput): Promise<Education> {
  const { data } = await api.post<Education>("/portfolio/educations", input);
  return data;
}

async function updateEducation(
  id: string,
  input: Partial<EducationInput>,
): Promise<Education> {
  const { data } = await api.patch<Education>(`/portfolio/educations/${id}`, input);
  return data;
}

async function deleteEducation(id: string): Promise<void> {
  await api.delete(`/portfolio/educations/${id}`);
}

async function createSkill(input: SkillInput): Promise<Skill> {
  const { data } = await api.post<Skill>("/portfolio/skills", input);
  return data;
}

async function updateSkill(id: string, input: Partial<SkillInput>): Promise<Skill> {
  const { data } = await api.patch<Skill>(`/portfolio/skills/${id}`, input);
  return data;
}

async function deleteSkill(id: string): Promise<void> {
  await api.delete(`/portfolio/skills/${id}`);
}

async function createProject(input: ProjectInput): Promise<Project> {
  const { data } = await api.post<Project>("/portfolio/projects", input);
  return data;
}

async function updateProject(
  id: string,
  input: Partial<ProjectInput>,
): Promise<Project> {
  const { data } = await api.patch<Project>(`/portfolio/projects/${id}`, input);
  return data;
}

async function deleteProject(id: string): Promise<void> {
  await api.delete(`/portfolio/projects/${id}`);
}

async function createCertification(input: CertificationInput): Promise<Certification> {
  const { data } = await api.post<Certification>("/portfolio/certifications", input);
  return data;
}

async function updateCertification(
  id: string,
  input: Partial<CertificationInput>,
): Promise<Certification> {
  const { data } = await api.patch<Certification>(
    `/portfolio/certifications/${id}`,
    input,
  );
  return data;
}

async function deleteCertification(id: string): Promise<void> {
  await api.delete(`/portfolio/certifications/${id}`);
}

async function createAchievement(input: AchievementInput): Promise<Achievement> {
  const { data } = await api.post<Achievement>("/portfolio/achievements", input);
  return data;
}

async function updateAchievement(
  id: string,
  input: Partial<AchievementInput>,
): Promise<Achievement> {
  const { data } = await api.patch<Achievement>(`/portfolio/achievements/${id}`, input);
  return data;
}

async function deleteAchievement(id: string): Promise<void> {
  await api.delete(`/portfolio/achievements/${id}`);
}

async function createSocialLink(input: SocialLinkInput): Promise<SocialLink> {
  const { data } = await api.post<SocialLink>("/portfolio/social-links", input);
  return data;
}

async function updateSocialLink(
  id: string,
  input: Partial<SocialLinkInput>,
): Promise<SocialLink> {
  const { data } = await api.patch<SocialLink>(`/portfolio/social-links/${id}`, input);
  return data;
}

async function deleteSocialLink(id: string): Promise<void> {
  await api.delete(`/portfolio/social-links/${id}`);
}

const portfolioService = {
  getPortfolio,
  updatePersonalInfo,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  createSkill,
  updateSkill,
  deleteSkill,
  createProject,
  updateProject,
  deleteProject,
  createCertification,
  updateCertification,
  deleteCertification,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
};

export default portfolioService;
