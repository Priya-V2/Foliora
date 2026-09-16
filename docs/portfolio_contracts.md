# Portfolio Contracts

**Version:** 1.1  
**Status:** Contract Source of Truth

## 1. Purpose

This document defines the exact contracts used by Foliora's portfolio rendering system.

It complements:

```text
PORTFOLIO_ARCHITECTURE.md
        +
TEMPLATE_RULES.md
```

The architecture defines **how the system is structured**.

The rules define **how implementations must behave**.

This document defines **the exact data and component contracts exchanged between the system's parts**.

Implementation agents and developers must not invent alternative shapes for these contracts.

---

## 2. Contract Flow

```text
External Sources
(Database / API / Editor / Onboarding / Examples)
                        │
                        ▼
              PortfolioDataAdapter
                        │
                        ▼
                 PortfolioData
                        │
                        ▼
                 PortfolioRenderer
                        │
                        ▼
             TemplateRegistry.resolve()
                        │
                        ▼
                TemplateDefinition
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        Renderer Props       CardPreview Props
             │                     │
             ▼                     ▼
       Full Portfolio UI       Compact Card UI
```

---

## 3. Contract Principles

1. **One canonical portfolio rendering shape**
2. **Templates receive canonical data only**
3. **External/database shapes are converted by adapters**
4. **Template IDs are stable**
5. **Template versions are explicit**
6. **A portfolio's `templateId` + `templateVersion` pair is persisted and must not silently change**
7. **Full template implementations are lazy-loaded; registry resolution is asynchronous**
8. **Section configuration controls visibility and order**
9. **Portfolio theme is separate from Foliora application theme**
10. **Example data uses the same canonical contract as user data**
11. **Full templates and card previews have explicit prop contracts**
12. **MVP section scope is explicit; deferred sections are documented, not implemented**
13. **Contracts must not be silently changed by individual templates**

---

# 4. Core PortfolioData Contract

```ts
export interface PortfolioData {
  profile: ProfileData;

  about?: AboutData;

  experience: ExperienceData[];
  education: EducationData[];
  skills: SkillData[];
  projects: ProjectData[];
  certifications: CertificationData[];
  achievements: AchievementData[];

  socialLinks: SocialLinkData[];

  sections: PortfolioSectionConfig[];

  theme?: PortfolioTheme;
}
```

## Rules

- Templates receive `PortfolioData`.
- Templates do not receive raw database entities.
- User data and example data must both conform to this contract.
- Published portfolio data must be adapted into this contract before rendering.
- New portfolio content must extend this contract deliberately.

---

# 5. ProfileData

```ts
export interface ProfileData {
  name: string;
  headline?: string;
  location?: string;
  profileImageUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
}
```

`phone` and `website` are included because Foliora's existing personal-info data already captures this information and the Contact section (see §12) needs it.

## Contact Section

Contact is an MVP-supported presentation section, not a separate content model.

- Templates may render a Contact section using `PortfolioData.profile` (`email`, `phone`, `website`, `location`).
- There is no `ContactData` interface. Contact does not need one because the profile fields above already carry the information a Contact section renders.
- Templates must not access raw database structures (e.g. `PersonalInfo`) directly to obtain contact information — it must come through `PortfolioData.profile`.

---

# 6. AboutData

```ts
export interface AboutData {
  content: string;
}
```

`about` is optional because a portfolio may not contain an About section.

---

# 7. ExperienceData

```ts
export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}
```

---

# 8. EducationData

```ts
export interface EducationData {
  id: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
```

---

# 9. SkillData

```ts
export interface SkillData {
  id: string;
  name: string;
  category?: string;
  level?: SkillLevel;
}

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
```

`level` is optional because templates must not assume every portfolio provides a skill rating.

---

# 10. ProjectData

```ts
export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  technologies?: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  startDate?: string;
  endDate?: string;
}
```

---

# 11. CertificationData

```ts
export interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  credentialId?: string;
  credentialUrl?: string;
  issueDate?: string;
  logoUrl?: string;
}
```

Fields mirror Foliora's existing `Certification` model/DTOs. Certifications are part of the MVP canonical `PortfolioData` contract.

---

# 12. AchievementData

```ts
export interface AchievementData {
  id: string;
  title: string;
  description?: string;
  metric?: string;
  achievedAt?: string;
}
```

Fields mirror Foliora's existing `Achievement` model/DTOs. Achievements are part of the MVP canonical `PortfolioData` contract.

---

# 13. SocialLinkData

```ts
export interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  label?: string;
}
```

The canonical contract stores social links generically. Templates may choose presentation based on `platform`, but portfolio data must not contain template-specific icon components.

---

# 14. PortfolioSectionConfig

Foliora separates portfolio content from portfolio structure.

```ts
export interface PortfolioSectionConfig {
  type: PortfolioSectionType;
  enabled: boolean;
  displayOrder: number;
  customTitle?: string;
  configuration?: Record<string, unknown>;
}

export type PortfolioSectionType =
  | "about"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "achievements"
  | "contact"
  | "social";
```

## Section Rendering Rules

Templates use section configuration to determine:

```text
1. Whether a section should render
2. Where it should appear relative to other configurable sections
3. Whether its default title is overridden
```

Conceptually:

```text
sections
   ↓
Filter enabled sections
   ↓
Sort by displayOrder
   ↓
Resolve section content
   ↓
Render using template-specific presentation
```

`PortfolioSectionConfig` controls structure, not visual design.

The primary portfolio identity remains:

```text
PortfolioData.profile
```

Hero/header treatment is template-specific and is not currently represented as a reorderable content section.

## MVP Section Scope

`PortfolioSectionType` intentionally excludes `custom`, `blogs`, and `testimonials` for v1. See §25 for the full statement of MVP scope versus deferred capability.

---

# 15. PortfolioTheme

`PortfolioTheme` is portfolio-level visual configuration and is separate from Foliora's application theme.

```ts
export interface PortfolioTheme {
  accentColor?: string;
  fontFamily?: string;
  backgroundColor?: string;
  textColor?: string;
}
```

## Theme Rules

- Raw database theme JSON must be adapted into `PortfolioTheme`.
- Templates provide safe defaults.
- Portfolio theme must not depend on dashboard or app-shell theme state.
- This is intentionally a small v1 contract.

Do not add template-internal concepts such as `layoutVariant` unless there is a concrete portfolio-level requirement.

---

# 16. ExampleProfile

```ts
export interface ExampleProfile {
  id: string;
  label: string;
  profession: string;
  data: PortfolioData;
}
```

Example profiles are demonstration data only. They use the exact same renderer and templates as user data, and the exact same canonical `PortfolioData` contract — including `certifications` and `achievements` — as user and published data.

---

# 17. Template Identity Contract

```ts
export interface TemplateIdentity {
  templateId: string;
  templateVersion: string; // SemVer: MAJOR.MINOR.PATCH
}
```

`templateVersion` MUST follow Semantic Versioning (`MAJOR.MINOR.PATCH`) and is always a string. Do not use bare numeric versions such as `"1"`.

Example:

```ts
{
  templateId: "modern",
  templateVersion: "1.0.0"
}
```

Display names are not implementation identifiers.

A portfolio persists both `templateId` and `templateVersion` as the stable record of which template implementation it was built/published against. See `PORTFOLIO_ARCHITECTURE.md` §6 and `database.md` for the persistence requirement and its rationale.

---

# 18. TemplateProps

Every full portfolio template receives:

```ts
export interface TemplateProps {
  data: PortfolioData;
}
```

All full templates use this contract.

---

# 19. CardPreviewProps

```ts
export interface CardPreviewProps {
  data: PortfolioData;
}
```

A card preview receives canonical data but may intentionally display only selected information.

It does not require a separate compact portfolio data model.

---

# 20. TemplateDefinition

```ts
export interface TemplateDefinition extends TemplateIdentity {
  Renderer: React.ComponentType<TemplateProps>;

  CardPreview: React.ComponentType<CardPreviewProps>;

  exampleProfiles: ExampleProfile[];
}
```

Conceptually:

```ts
export const modernV1Definition: TemplateDefinition = {
  templateId: "modern",
  templateVersion: "1.0.0",
  Renderer: ModernTemplate,
  CardPreview: ModernCardPreview,
  exampleProfiles: [
    softwareEngineerExample,
    productDesignerExample,
    marketingProfessionalExample,
  ],
};
```

The exact registry object key is an implementation detail. The stable contract is `templateId + templateVersion`.

The full `Renderer` implementation referenced by a `TemplateDefinition` is lazy-loaded — see §21 — rather than eagerly bundled with the registry entry itself.

---

# 21. Template Registry Resolution Contract

Because full template implementations are lazy-loaded (see `PORTFOLIO_ARCHITECTURE.md` and `TEMPLATE_RULES.md`), resolution is asynchronous:

```ts
resolveTemplate(
  templateId: string,
  templateVersion: string
): Promise<TemplateDefinition | null>;
```

The implementation may use static or dynamic imports under the hood. Consumers must depend on the resolution contract, not the loading strategy.

`PortfolioRenderer` (see §22) is responsible for handling the pending/loading state while a call to `resolveTemplate` is in flight, and the not-found/failure state if it resolves to `null`.

---

# 22. PortfolioRenderer Contract

```ts
export interface PortfolioRendererProps extends TemplateIdentity {
  data: PortfolioData;
}
```

Usage:

```tsx
<PortfolioRenderer
  templateId="modern"
  templateVersion="1.0.0"
  data={portfolioData}
/>
```

The renderer must:

1. Resolve the requested template/version via the (asynchronous) `TemplateRegistry`.
2. Render a controlled loading state while resolution is pending.
3. Render the matching template once resolved.
4. Pass canonical `PortfolioData`.
5. Handle invalid/failed resolution in a controlled way (see §23).

The renderer must not contain template-specific layout code.

---

# 23. Renderer Failure Behaviour

If:

```text
Requested: modern@1.0.0
Registry: not found
```

the renderer must **not silently render a different template**.

Correct:

```text
modern@1.0.0 missing
      ↓
Controlled unavailable state
```

The unavailable state should:

- Clearly indicate that the requested portfolio cannot currently be rendered.
- Avoid exposing raw internal errors to public visitors.
- Provide useful diagnostic information in development.

No automatic template substitution is allowed.

This is distinct from the loading state described in §21/§22, which applies while resolution is still pending rather than after it has failed.

---

# 24. Data Source Contract

All rendering sources eventually produce:

```text
PortfolioData
+
TemplateIdentity
```

Examples:

```text
Database/API → Adapter → PortfolioData
ExampleProfile.data → PortfolioData
Editor State → Adapter/Normalization → PortfolioData
Published Portfolio → Adapter → PortfolioData + TemplateIdentity
```

Templates must not know which source produced the data.

---

# 25. v1 Portfolio Content Scope

The initial (MVP) portfolio rendering contract includes:

- Profile (Hero)
- About
- Experience
- Education
- Skills
- Projects
- Certifications
- Achievements
- Social Links
- Contact
- Section Configuration
- Portfolio Theme

## Database Capability vs. MVP Rendering Contract vs. Deferred

Foliora's database may contain enum values or infrastructure beyond what the MVP rendering contract supports. These are three distinct concerns:

```text
1. What the database may support
   → e.g. the `SectionType` enum also defines BLOGS, TESTIMONIALS, and CUSTOM.

2. What the MVP canonical PortfolioData / PortfolioSectionType contract supports
   → exactly the list above; nothing else.

3. What is explicitly deferred from the v1 rendering/data contract
   → Blogs, Testimonials, Custom sections.
```

The following are intentionally outside the v1 rendering contract:

```text
Blogs
Testimonials
Custom sections (CUSTOM)
```

- Their exclusion is a deliberate v1 scope decision, not an architectural prohibition.
- The database is not required to remove or change existing `BLOGS` / `TESTIMONIALS` / `CUSTOM` support as a result of this scope decision.
- `CUSTOM` in particular must not be represented as a supported MVP rendering contract: `PortfolioSectionType` does not include `"custom"`, `PortfolioData` has no generic custom-content field, and MVP templates are not required to render arbitrary custom sections.
- When Blogs, Testimonials, or custom-section rendering are supported later, they must be added centrally to the canonical contract and section system — not as one-off fields inside individual templates.

---

# 26. Contract Evolution Rules

When changing core contracts:

1. Update this specification.
2. Update the TypeScript source of truth.
3. Update adapters.
4. Review all templates.
5. Review example profiles.
6. Review public rendering.
7. Review export compatibility when applicable.

Individual templates must not privately redefine canonical interfaces.

Incorrect:

```ts
interface ModernPortfolioData {
  // Different version of PortfolioData
}
```

Correct:

```ts
import type { PortfolioData } from "../types";
```

---

# 27. Recommended Type Source Structure

```text
features/portfolio/
│
├── types/
│   ├── portfolio-data.ts
│   ├── profile.ts
│   ├── about.ts
│   ├── experience.ts
│   ├── education.ts
│   ├── skill.ts
│   ├── project.ts
│   ├── certification.ts
│   ├── achievement.ts
│   ├── social-link.ts
│   ├── portfolio-section.ts
│   ├── portfolio-theme.ts
│   ├── example-profile.ts
│   └── template.ts
│
├── adapters/
├── renderer/
├── registry/
├── templates/
└── preview/
```

Exact file grouping may adapt to Foliora's existing conventions, but the contract boundaries must remain consistent.

---

# 28. Final Contract Model

```text
                    DATA SOURCES
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
      USER DATA     EXAMPLE DATA   PUBLISHED DATA
         │              │              │
         └──────────────┼──────────────┘
                        ↓
              PortfolioDataAdapter
                        ↓
                 PortfolioData
                 │           │
                 │           └── PortfolioTheme
                 │
                 └── PortfolioSectionConfig[]
                        ↓
                 PortfolioRenderer
                        ↓
          templateId + templateVersion
                        ↓
        TemplateRegistry.resolveTemplate()
                   (async)
                        ↓
                TemplateDefinition
                 │           │
                 ▼           ▼
             Renderer    CardPreview
                 │           │
                 ▼           ▼
          Full Portfolio   Compact Card
```

# Final Principle

**Architecture defines the system.  
Rules define implementation boundaries.  
Contracts define exact agreements.**

No core portfolio rendering structure should be invented ad hoc during implementation.
