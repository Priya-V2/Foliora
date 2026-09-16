# Portfolio Architecture

**Version:** 1.2  
**Status:** Architecture Source of Truth

## 1. Purpose

This document defines Foliora's architecture for dynamically rendering portfolio templates across:

- Template cards
- Onboarding
- Full preview
- User Data / Example Data preview
- Responsive preview
- Dashboard
- Editor preview
- Public portfolios
- Publishing
- Code export

The architecture prevents each product area from creating its own portfolio rendering implementation.

---

## 2. Core Architecture

```text
USER DATA / EXAMPLE DATA / PUBLISHED DATA
                    │
                    ▼
           Portfolio Data Adapter
                    │
                    ▼
          CANONICAL PortfolioData
                    │
                    ▼
             PortfolioRenderer
                    │
                    ▼
       Version-aware TemplateRegistry
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Modern v1     Minimal      Creative
        │           │           │
        └───────────┼───────────┘
                    ▼
               PORTFOLIO UI
                    │
  ┌─────────┬───────┼───────┬────────┬─────────┐
  ▼         ▼       ▼       ▼        ▼         ▼
 Card     Preview  Editor Dashboard Public    Export
```

**One canonical data contract.  
One renderer entry point.  
One version-aware registry.  
Many portable templates.  
Many product experiences.**

---

## 3. Canonical PortfolioData

Portfolio information may originate from:

```text
Database
API responses
Onboarding state
Editor state
Example profiles
Published portfolio data
```

These sources must not directly control template rendering.

All rendering uses one canonical contract:

```text
PortfolioData
```

Conceptually:

```ts
interface PortfolioData {
  profile: ProfileData;
  about?: AboutData;

  experience: ExperienceData[];
  education: EducationData[];
  skills: SkillData[];
  projects: ProjectData[];
  certifications: CertificationData[];
  achievements: AchievementData[];
  socialLinks?: SocialLinkData[];

  sections: PortfolioSectionConfig[];

  theme?: PortfolioTheme;
}
```

The exact fields may evolve, but there must be one canonical rendering contract.

### 3.1 Portfolio Theme

Portfolio theme belongs to the portfolio domain:

```text
Foliora Application Theme
        ≠
Portfolio Theme
```

The database representation of theme is converted through the adapter into canonical portfolio theme data. Raw database JSON must not leak directly into templates.

### 3.2 MVP Section Scope

Foliora distinguishes three separate concerns:

```text
1. Database capability   → what the schema/enums may support
2. MVP rendering contract → what canonical PortfolioData/PortfolioSectionType actually support in v1
3. Deferred capability    → explicitly out of scope for v1, not removed from the database
```

The MVP canonical contract supports:

```text
Hero / Profile
About
Experience
Education
Skills
Projects
Certifications
Achievements
Social Links
Contact
```

The following are deferred from the v1 rendering/data contract:

```text
Blogs
Testimonials
Custom sections (CUSTOM)
```

The database may retain enum values or infrastructure for deferred section types (for example a `CUSTOM` `SectionType`). That does not make them part of the MVP rendering contract. `CUSTOM` in particular must not be implemented or represented as a supported MVP rendering contract — MVP templates are not required to render arbitrary custom sections. See `PORTFOLIO_CONTRACTS.md` for the exact type-level statement of this scope.

---

## 4. Portfolio Data Adapter

External data is converted before rendering:

```text
Database / API / Form / Example Data
                 │
                 ▼
        PortfolioDataAdapter
                 │
                 ▼
           PortfolioData
                 │
                 ▼
         PortfolioRenderer
```

Templates must not know whether their data originated from the database, onboarding, editor, examples, or published records.

---

## 5. PortfolioRenderer

`PortfolioRenderer` is the shared entry point for full portfolio rendering.

Conceptually:

```tsx
<PortfolioRenderer
  templateId="modern"
  templateVersion="1.0.0"
  data={portfolioData}
/>
```

Responsibilities:

1. Receive canonical `PortfolioData`.
2. Receive `templateId`.
3. Receive `templateVersion`.
4. Resolve the correct template definition through the (asynchronous) `TemplateRegistry`.
5. Render a controlled loading state while resolution is pending.
6. Render the correct implementation once resolved.
7. Pass canonical data to that template.
8. Render a controlled failure state if resolution fails or returns nothing.

Because full template implementations are lazy-loaded (see §21), resolution is not instantaneous. `PortfolioRenderer` — not individual features — owns the loading and failure states while the required implementation is being resolved. It must not contain template-specific layout or styling.

---

## 6. Template Identity and Versioning

Template identity consists of:

```text
templateId
+
templateVersion
```

`templateVersion` follows Semantic Versioning (`MAJOR.MINOR.PATCH`) and is always treated as a string — never a bare numeric value.

Example:

```text
modern + 1.0.0
```

Conceptually:

```ts
{
  templateId: "modern",
  templateVersion: "1.0.0" // SemVer: MAJOR.MINOR.PATCH
}
```

This allows:

```text
modern
├── v1
└── v2
```

A published portfolio using `modern + v1` must continue resolving to a compatible implementation rather than silently switching to a later version.

The initial implementation may contain only `modern + v1`.

### 6.1 Persistence Requirement

A portfolio must persist **both** `templateId` and `templateVersion` — not `templateId` alone.

This is what makes template stability possible. For example, if a user publishes a portfolio using `Modern v1.0.0` and `Modern` later becomes `v1.1.0` in the catalog, the existing portfolio must continue rendering with `v1.0.0` — the version it was created/published against — unless the user explicitly changes the template or version. Storing only `templateId` would leave a portfolio implicitly following whatever version the catalog currently points to, which breaks this guarantee.

See `database.md` for the corresponding data-persistence requirement, and `PORTFOLIO_CONTRACTS.md` §17 for the `TemplateIdentity` contract this pair satisfies.

---

## 7. TemplateDefinition

Each template/version exposes a standard definition:

```ts
interface TemplateDefinition {
  templateId: string;
  templateVersion: string;

  Renderer: React.ComponentType<TemplateProps>;
  CardPreview: React.ComponentType<CardPreviewProps>;

  exampleProfiles: ExampleProfile[];
}
```

`TemplateCapabilities` is intentionally excluded until a real consumer requires it.

---

## 8. Template Registry

The Template Registry is the central implementation mapping:

```text
templateId + templateVersion
            │
            ▼
     TemplateRegistry
            │
            ▼
    TemplateDefinition
            │
            ▼
  Template Implementation
```

Features must not scatter:

```tsx
if (templateId === "modern") {
  return <ModernTemplate />;
}
```

Normal rendering always follows:

```text
Feature
   ↓
PortfolioRenderer
   ↓
TemplateRegistry
   ↓
Correct Template Version
```

### 8.1 Asynchronous Resolution and Loading States

Registry resolution is asynchronous:

```ts
resolveTemplate(
  templateId: string,
  templateVersion: string
): Promise<TemplateDefinition | null>;
```

This is a direct consequence of lazy loading (§21): a full template implementation may need to be fetched before it can be resolved, so resolution cannot be assumed to complete synchronously. `PortfolioRenderer` is responsible for presenting a controlled loading state while a resolution is pending and a controlled failure state if it resolves to `null`. Individual features must not implement their own resolution loading/error handling outside `PortfolioRenderer`.

---

## 9. Database Catalog vs Code Registry

Foliora has two related but different systems.

### Database Template Catalog

Owns product metadata such as:

- Display name
- Category
- Premium status
- Visibility
- Other database metadata

### Code Template Registry

Owns:

- React implementation
- Card preview
- Example profiles
- Version-aware renderer resolution

They are related but not interchangeable.

### 9.1 Sync Validation

Foliora should maintain a lightweight automated validation mechanism at build, test, seed, or equivalent time:

```text
DB Catalog
    ↔
Code Registry
    ↓
Validation
```

The goal is to catch an active catalog template with no registered implementation before runtime.

---

## 10. Template Implementations

Each portfolio design is implemented in code.

```text
templates/
├── modern/
│   ├── ModernTemplate.tsx
│   ├── ModernCardPreview.tsx
│   ├── modern.definition.ts
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   └── Footer.tsx
│   └── examples/
│       ├── software-engineer.ts
│       ├── product-designer.ts
│       └── marketing-professional.ts
├── minimal/
└── creative/
```

Each template owns its visual implementation.

---

## 11. Full Template and Card Preview

### Full Template

The full template is the source of truth for complete portfolio UI.

Example:

```text
ModernTemplate.tsx
```

The same full implementation is reused for:

- Full preview
- Editor preview
- Public portfolio rendering

Different experiences may provide different shells or controls, but they must not duplicate full portfolio implementations.

### Card Preview

A compact card preview is a separate component:

```text
ModernCardPreview.tsx
```

It may render selected visual content such as:

- Hero
- Profile image
- Name
- Headline
- Template identity

It does not need to render the complete portfolio.

Used by:

```text
Onboarding Template Cards
Dashboard Portfolio Card
```

---

## 12. Example Data

Example data conforms to the same:

```text
PortfolioData
```

The renderer does not care whether it receives:

```text
User Data
```

or:

```text
Example Data
```

```text
Selected Data
      ↓
PortfolioData
      ↓
PortfolioRenderer
      ↓
Template
```

Templates may provide multiple professional examples:

```text
Software Engineer
Product Designer
Marketing Professional
```

Example profiles are demonstration data only, not user or published records.

---

## 13. Preview Architecture

Preview is a shell around the renderer:

```text
PortfolioPreview
│
├── Your Data / Example Data
├── Example Profile Controls
├── Desktop / Tablet / Mobile Controls
│
└── PortfolioRenderer
        ↓
 Selected Template Version
```

Templates render portfolios. Preview shells own product-level controls.

---

## 14. Responsive Rendering

Each full template must be genuinely responsive.

Correct:

```text
One Responsive Template
        +
Different Preview Viewport Constraints
```

Incorrect:

```text
DesktopTemplate
TabletTemplate
MobileTemplate
```

The preview shell may simulate desktop, tablet, and mobile constraints while the template responds naturally to its viewport.

---

## 15. Server and Client Rendering Boundary

Public portfolio rendering follows:

```text
Public Route
    ↓
Server Component
    ├── Fetch published portfolio
    └── Prepare serializable data
              ↓
      Client PortfolioRenderer
              ↓
           Template
```

The server boundary owns fetching and publication validation.

The client rendering boundary may support interactive behavior and animation libraries such as Framer Motion.

Templates must not fetch database or server data themselves.

---

## 16. Feature Consumption

The shared rendering system is consumed by:

```text
Onboarding
Dashboard
Editor
Preview
Public Portfolio
Publish
Export
```

Features may have different workflows and surrounding UI, but must not create competing portfolio rendering systems.

### Onboarding

```text
Choose Template
       ↓
Template Cards
       ↓
Open Preview
       ├── Your Data
       ├── Example Data
       └── Device Views
       ↓
Select Template
       ↓
Confirm
```

### Editor

```text
Editor Data
    ↓
PortfolioData
    ↓
PortfolioRenderer
    ↓
Selected Template
```

### Dashboard

```text
Selected Template
        +
User PortfolioData
        ↓
CardPreview
```

---

## 17. Publishing Boundary

Draft and publishing lifecycle are backend concerns.

The rendering architecture does not define persistence mechanics.

Before implementing Publish/Public Portfolio, Foliora must define:

```text
Draft
   │ Publish
   ▼
Published Snapshot
```

The publishing architecture must answer:

- Does publishing create a snapshot?
- Do edits immediately affect the public portfolio?
- How does republishing work?
- How does unpublishing work?

These rules must not be invented inside frontend rendering code.

---

## 18. Public Portfolio Flow

Once publishing architecture is defined:

```text
Portfolio Slug
      ↓
Published Portfolio
      ├── PortfolioData
      ├── templateId
      └── templateVersion
              ↓
       PortfolioRenderer
              ↓
       TemplateRegistry
              ↓
      Correct Template Version
```

Example:

```text
foliora.com/test-user-1
```

Public route code must not contain template-specific conditional rendering.

---

## 19. Export Architecture Boundary

The target flow is:

```text
EXPORT REQUEST
      ↓
Portfolio Data
+
Template + Version
+
Template Source
+
Assets
      ↓
Export Engine
      ↓
Next.js Project Files
      ↓
ZIP Generator
      ↓
PORTFOLIO.ZIP
```

Before Export implementation, Foliora must explicitly decide the cross-runtime strategy for accessing:

- Template source
- Shared compatible code
- `PortfolioData` contract
- Assets

Do not solve this by allowing backend services to depend on arbitrary frontend application internals.

A dedicated export boundary or shared package strategy may be introduced when Export requires it.

Export is deliberately different from in-application rendering: the exported project receives the actual selected `Template Source` required to produce a generated, standalone portfolio — it does not depend on the live Foliora application, and it does not go through the application's lazy-loading `TemplateRegistry` at runtime.

---

## 20. Portable Template Boundary

Templates are expected to become exportable units.

Therefore templates must not depend on:

- Dashboard UI
- App-shell components
- Feature services
- Feature stores
- Authentication logic
- Database access
- Foliora-only routing logic

Template dependencies must remain controlled and portable.

Detailed implementation constraints are defined in `TEMPLATE_RULES.md`.

---

## 21. Lazy Loading (MVP Requirement)

Lazy loading of full template implementations is **required for MVP** — it is not future-readiness or an optional optimization.

```text
Selected Template
        ↓
Load Selected Implementation
```

rather than:

```text
Load Every Template
        ↓
User Selects One
```

Concretely:

- Template cards/gallery (onboarding cards, dashboard cards) remain lightweight and must not pull in full template implementations.
- A full template implementation loads only when it is actually needed — full preview, editor preview, opening a card's full view, or public rendering of a selected template.
- The application must not eagerly load every full template implementation on initial application load.
- Full preview, editor preview, and public rendering all resolve the required implementation through the `TemplateRegistry` (see §8.1), which is why registry resolution is asynchronous.
- Appropriate loading and failure states must exist while a full template implementation is being resolved (owned by `PortfolioRenderer`, see §5).
- This does not create separate desktop/tablet/mobile implementations — responsive behavior stays inside the one lazily-loaded template implementation (see §14).
- Export is the one exception to lazy loading at runtime: the exported project receives the actual selected template source directly (see §19), rather than depending on the application's registry.

---

## 22. Recommended Folder Structure

```text
client/src/features/portfolio/
│
├── types/
│   ├── portfolio-data.ts
│   ├── portfolio-theme.ts
│   └── template.ts
│
├── adapters/
│   └── portfolio-data.adapter.ts
│
├── renderer/
│   └── PortfolioRenderer.tsx
│
├── registry/
│   └── template.registry.ts
│
├── templates/
│   ├── modern/
│   │   ├── ModernTemplate.tsx
│   │   ├── ModernCardPreview.tsx
│   │   ├── modern.definition.ts
│   │   ├── components/
│   │   └── examples/
│   ├── minimal/
│   └── creative/
│
├── preview/
│   └── PortfolioPreview.tsx
│
└── utils/
```

Exact paths may adapt to Foliora's existing conventions, but responsibility boundaries must remain.

---

## 23. Final System Model

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
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
       Portfolio Content    Portfolio Theme
                        ↓
                 PortfolioRenderer
                        ↓
             Version-aware Registry
                        ↓
            ┌───────────┼───────────┐
            ▼           ▼           ▼
        Modern v1     Minimal     Creative
                        ↓
                   PORTFOLIO UI
```

## Final Principle

**One canonical data contract.  
One renderer entry point.  
One version-aware registry.  
Many portable templates.  
Many product experiences.**
