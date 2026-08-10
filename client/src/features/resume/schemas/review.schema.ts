import { z } from "zod";
import { SkillCategory } from "@/types/portfolio.types";

// Mirrors server/src/portfolio/dto/*.dto.ts. Kept intentionally permissive
// on the frontend (final validation is the backend's job, see
// docs/backend.md "Validation") - this layer exists only to give the user
// immediate, friendly feedback before a request is sent.
//
// Numeric fields (yearsOfExperience, cgpa, proficiency) are kept as plain
// strings here rather than z.coerce.number() - native number inputs already
// produce string values via RHF's `register`, and mixing z.coerce with
// z.literal("") unions breaks TS inference between the resolver's input and
// output types. Values are parsed to Number(...) at submit time instead.

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const optionalUrl = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((value) => value === "" || /^([\w-]+\.)+[\w-]+([/?#].*)?$/.test(value), {
      message: "Enter a valid URL",
    })
    .optional()
    .or(z.literal(""));

function optionalNumericText(min: number, max: number, label: string) {
  return z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => {
        if (!value) return true;
        const num = Number(value);
        return !Number.isNaN(num) && num >= min && num <= max;
      },
      { message: `${label} must be between ${min} and ${max}` },
    );
}

export const personalInfoSchema = z.object({
  fullName: optionalText(150),
  role: optionalText(150),
  headline: optionalText(200),
  bio: optionalText(2000),
  location: optionalText(150),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").optional().or(z.literal("")),
  phone: optionalText(30),
  website: optionalUrl(300),
  availability: optionalText(100),
  yearsOfExperience: optionalNumericText(0, 80, "Years of experience"),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export const experienceSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required").max(150),
    role: z.string().trim().min(1, "Role is required").max(150),
    location: optionalText(150),
    description: optionalText(2000),
    technologies: z.array(z.string()),
    achievements: z.array(z.string()),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    current: z.boolean(),
  })
  .refine((data) => data.current || Boolean(data.endDate), {
    message: "Set an end date or mark this as current",
    path: ["endDate"],
  });

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(200),
  degree: z.string().trim().min(1, "Degree is required").max(200),
  fieldOfStudy: optionalText(150),
  cgpa: optionalNumericText(0, 10, "CGPA"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  description: optionalText(2000),
});

export type EducationFormValues = z.infer<typeof educationSchema>;

const skillCategoryValues = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "CLOUD",
  "DEVOPS",
  "MOBILE",
  "TOOLS",
  "LANGUAGE",
  "OTHER",
] as const satisfies readonly SkillCategory[];

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Skill name is required").max(60),
  category: z.enum(skillCategoryValues),
  proficiency: optionalNumericText(1, 5, "Proficiency"),
});

export type SkillFormValues = z.infer<typeof skillSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Project title is required").max(150),
  description: optionalText(2000),
  techStack: z.array(z.string()),
  githubUrl: optionalUrl(300),
  demoUrl: optionalUrl(300),
  imageUrl: optionalUrl(500),
  featured: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const certificationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  issuer: z.string().trim().min(1, "Issuer is required").max(150),
  credentialId: optionalText(150),
  credentialUrl: optionalUrl(300),
  issueDate: z.string().optional().or(z.literal("")),
  logoUrl: optionalUrl(500),
});

export type CertificationFormValues = z.infer<typeof certificationSchema>;

export const achievementSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: optionalText(2000),
  metric: optionalText(100),
  achievedAt: z.string().optional().or(z.literal("")),
});

export type AchievementFormValues = z.infer<typeof achievementSchema>;

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Platform is required").max(50),
  url: optionalUrl(300).refine((value) => Boolean(value), "URL is required"),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;
