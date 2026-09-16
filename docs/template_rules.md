# Template Rules

**Version:** 1.2  
**Status:** Implementation Rulebook

## 1. Purpose

This document defines the strict implementation rules for Foliora's portfolio templates and portfolio rendering system.

It is the operational companion to:

```text
PORTFOLIO_ARCHITECTURE.md
```

All portfolio template implementation and modification must follow these rules.

The goal is to keep the system:

- Dynamic
- Reusable
- Consistent
- Maintainable
- Version-aware
- Responsive
- Portable for future export

---

## 2. Core Rule

```text
ONE PortfolioData contract
        ↓
ONE PortfolioRenderer
        ↓
ONE version-aware TemplateRegistry
        ↓
MANY Template Implementations
        ↓
MANY Product Experiences
```

Do not create alternative rendering systems for individual features.

---

## 3. Canonical Data Rule

All full portfolio templates receive data through:

```text
PortfolioData
```

Templates must not directly depend on:

- Database entities
- Prisma models
- Raw API response structures
- Onboarding form state
- Editor form state
- Published database models

Required flow:

```text
External Data
      ↓
Portfolio Data Adapter
      ↓
PortfolioData
      ↓
PortfolioRenderer
      ↓
Selected Template
```

### 3.1 MVP Section Scope Rule

Templates support exactly the MVP section contract — no more, no less:

```text
Hero / Profile (foundational, not a reorderable section)
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

- The database may retain `BLOGS`, `TESTIMONIALS`, and `CUSTOM` as `SectionType` enum values or supporting infrastructure. That is a database capability, not an MVP rendering requirement.
- `CUSTOM` is **not** supported in MVP: templates must not be required to render arbitrary `CUSTOM` sections, and `PortfolioSectionType` does not include `"custom"`.
- Templates must not implement Blogs or Testimonials rendering in MVP, and must not invent a custom-content rendering mechanism.
- See `PORTFOLIO_CONTRACTS.md` §25 for the authoritative statement of database capability vs. MVP contract vs. deferred capability.

---

## 4. Theme Rule

Portfolio theme belongs to the portfolio domain.

```text
Foliora App Theme
        ≠
Portfolio Theme
```

Templates may consume canonical portfolio theme data through the portfolio contract.

Templates must not depend on app-shell theme state or dashboard styling configuration.

Raw database theme JSON must not leak directly into template components.

---

## 5. Template Responsibility Rule

Templates are responsible for presentation.

They may handle:

- Layout
- Styling
- Typography
- Visual hierarchy
- Section composition
- Template-specific components
- Responsive behavior
- Template-level visual theme application

Templates must not handle:

- API requests
- Database access
- Authentication
- Saving data
- Publishing logic
- Export orchestration
- Application navigation
- Preview controls
- Dashboard state
- Feature services

---

## 6. No Direct Template Selection Logic

Do not scatter:

```tsx
if (templateId === "modern") {
  return <ModernTemplate data={data} />;
}
```

Normal full rendering must follow:

```text
PortfolioRenderer
        ↓
TemplateRegistry
        ↓
TemplateDefinition
        ↓
Selected Template Version
```

---

## 7. Template Definition Rule

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

Do not add speculative fields without a real consumer.

`TemplateCapabilities` is intentionally not part of the current contract.

---

## 8. Stable Identity and Version Rule

Template identity consists of:

```text
templateId + templateVersion
```

`templateVersion` follows Semantic Versioning (`MAJOR.MINOR.PATCH`) and is always a string, never a bare numeric value such as `"1"`.

Example:

```text
modern + 1.0.0
```

Display names are not implementation identifiers.

```text
templateId: "modern"
name: "Modern"
templateVersion: "1.0.0"
```

This identity is used for:

- Registry resolution
- Portfolio persistence
- Public rendering
- Published portfolio compatibility
- Export

A portfolio record must persist **both** `templateId` and `templateVersion`, not `templateId` alone — this is what lets a portfolio keep rendering with the version it was created/published against after the template's catalog entry moves to a newer version (e.g. `Modern v1.0.0` → `v1.1.0`). See `database.md` and `PORTFOLIO_ARCHITECTURE.md` §6.1.

Do not casually rename IDs or break compatibility for persisted versions.

A later `modern + v2` must not silently replace `modern + v1`.

---

## 9. Template Directory Rule

Each template owns its implementation:

```text
templates/
└── modern/
    ├── ModernTemplate.tsx
    ├── ModernCardPreview.tsx
    ├── modern.definition.ts
    ├── components/
    │   ├── Hero.tsx
    │   ├── About.tsx
    │   ├── Experience.tsx
    │   └── Projects.tsx
    └── examples/
        ├── software-engineer.ts
        ├── product-designer.ts
        └── marketing-professional.ts
```

Template-specific presentation components belong inside the template directory.

---

## 10. Full Template Rule

The full portfolio implementation is the source of truth for complete portfolio UI.

Example:

```text
ModernTemplate.tsx
```

The same full implementation is reused for:

- Full preview
- Editor preview
- Public portfolio rendering

Do not create separate full templates for these contexts.

---

## 11. Card Preview Rule

A compact template card is a separate component:

```text
ModernCardPreview.tsx
```

It may intentionally render:

- Hero area
- Profile image
- Name
- Headline
- Template-specific visual identity

It does not need to render the complete portfolio.

It is reused for:

```text
Onboarding Template Cards
Dashboard Portfolio Cards
```

Do not force the complete portfolio renderer into every card by merely scaling it down.

---

## 12. Example Data Rule

Example data must conform to:

```text
PortfolioData
```

The rendering system works identically with:

```text
User PortfolioData
```

and:

```text
Example PortfolioData
```

Do not create separate rendering implementations for user data and example data.

Example profiles may represent different professions, such as:

- Software Engineer
- Product Designer
- Marketing Professional

They are demonstration data only—not real user or published records.

---

## 13. Preview Controls Rule

Preview controls belong to the preview shell, not inside templates.

The preview system may provide:

- Your Data / Example Data toggle
- Example profile selection
- Desktop preview
- Tablet preview
- Mobile preview

```text
PortfolioPreview
│
├── Preview Controls
│
└── PortfolioRenderer
        ↓
Selected Template Version
```

Templates render portfolios only.

---

## 14. Responsive Design Rule

Every full template must be genuinely responsive.

Correct:

```text
One Responsive Template
        +
Different Preview Viewports
```

Incorrect:

```text
DesktopTemplate
TabletTemplate
MobileTemplate
```

unless a genuinely separate component is architecturally justified.

---

## 15. Renderer Rule

`PortfolioRenderer` resolves the selected template/version:

```tsx
<PortfolioRenderer
  templateId={templateId}
  templateVersion={templateVersion}
  data={portfolioData}
/>
```

It:

- Resolves the template definition asynchronously through the `TemplateRegistry`
- Renders a controlled loading state while resolution is pending
- Selects the correct implementation once resolved
- Passes canonical data
- Handles missing/invalid/failed resolution with a controlled failure state

It must not contain template-specific visual implementation.

---

## 16. Registry Rule

```text
templateId + templateVersion
        ↓
TemplateRegistry
        ↓
TemplateDefinition
        ↓
Template Implementation
```

Because full template implementations are lazy-loaded (Rule 28), registry resolution is asynchronous:

```ts
resolveTemplate(
  templateId: string,
  templateVersion: string
): Promise<TemplateDefinition | null>;
```

`PortfolioRenderer` owns the loading and failure states while resolution is pending (Rule 15). Do not implement separate resolution loading/error handling inside individual features.

When adding a new template/version:

1. Create the implementation.
2. Create the definition.
3. Register it centrally.
4. Ensure catalog metadata uses the correct stable ID.
5. Verify version compatibility.

Do not implement resolution independently in multiple features.

---

## 17. Catalog/Registry Validation Rule

Database catalog and code registry must be validated against expected relationships.

Do not rely only on manual checklists.

Foliora should maintain a lightweight automated validation mechanism through a script, test, build check, or equivalent process.

The goal is to catch missing implementation mappings before runtime.

---

## 18. Separation of Data and Presentation

Always preserve:

```text
DATA
 ↓
PortfolioData

RENDERING
 ↓
PortfolioRenderer

PRESENTATION
 ↓
Template
```

Templates do not own application data.

Data layers do not own template-specific presentation.

---

## 19. Feature Consumption Rule

These experiences consume the shared portfolio system:

```text
Onboarding
Dashboard
Editor
Preview
Public Portfolio
Publish
Export
```

They may provide different surrounding UI and workflows.

They must not create competing portfolio rendering architectures.

---

## 20. Onboarding Rule

Onboarding may:

- Display template cards
- Open full previews
- Switch user/example data
- Select example profiles
- Switch responsive views
- Select and confirm a template

It consumes the shared portfolio system and must not own duplicate template implementations.

---

## 21. Editor Rule

The editor owns:

- Form state
- Input controls
- Validation
- Save operations

The template system owns rendering.

The editor may pass current data to:

```text
PortfolioRenderer
```

but must not duplicate template layouts.

---

## 22. Dashboard Rule

Dashboard compact rendering should reuse:

```text
Selected Template
        +
User PortfolioData
        ↓
CardPreview
```

It must not manually recreate portfolio designs.

---

## 23. Public Rendering Rule

Public rendering resolves:

```text
Portfolio Slug
        ↓
Published Portfolio
        ↓
PortfolioData
+
templateId
+
templateVersion
        ↓
PortfolioRenderer
        ↓
Selected Template Version
```

Public routes must not contain template-specific conditional rendering.

---

## 24. Server/Client Boundary Rule

Templates must not fetch server or database data.

Public rendering follows:

```text
Server Component
       ↓
Fetch + prepare serializable data
       ↓
Client PortfolioRenderer
       ↓
Template
```

The exact component boundary may vary, but fetching and template presentation remain separated.

---

## 25. Publishing Boundary Rule

Templates and renderers must not decide:

- Draft persistence
- Published snapshot strategy
- Republish behavior
- Unpublish behavior

These belong to publishing/backend architecture.

Do not implement lifecycle assumptions inside template code.

---

## 26. Portable Template Boundary

Portfolio templates are expected to be exportable.

Therefore templates must not depend on Foliora-specific application infrastructure.

Do not import or depend on:

- Dashboard-only UI
- App-shell components
- Feature services
- Authentication logic
- Application stores
- Database clients
- Foliora-specific routing
- Foliora-only business logic

Avoid dependencies that would cause a copied template to fail outside Foliora.

---

## 27. Shared Components Rule

Extract shared components only when genuinely shared across templates.

Prefer:

```text
templates/modern/components/Hero.tsx
```

over:

```text
components/templates/Hero.tsx
```

when the component is template-specific.

Shared code must also respect the portable template boundary.

---

## 28. Lazy Loading Rule

Lazy loading of full template implementations is **required for MVP**, not future-readiness.

- Template cards/gallery must remain lightweight and must not import full template implementations.
- A full template implementation loads only when needed/selected — full preview, editor preview, or public rendering.
- The application must not eagerly load every full template implementation on initial application load.
- Full preview, editor preview, and public rendering all resolve the required implementation through the `TemplateRegistry` (Rule 16), which is why resolution is asynchronous.
- Appropriate loading and failure states must exist while a full template implementation is being resolved (Rule 15).
- This does not mean separate desktop/tablet/mobile implementations — responsive behavior stays inside one lazily-loaded implementation (Rule 14).
- Export is the exception: the exported project receives the actual selected template source directly (Rule 29), not the application's lazy-loading registry.

---

## 29. Export Rule

Export uses the same canonical portfolio identity:

```text
Portfolio Data
+
Template ID
+
Template Version
+
Template Source
+
Assets
```

Target pipeline:

```text
Export Engine
      ↓
Next.js Project Files
      ↓
ZIP Generator
      ↓
PORTFOLIO.ZIP
```

Before Export implementation, the cross-runtime strategy for template source and shared code must be explicitly decided.

Do not create arbitrary coupling between backend export services and frontend application internals.

---

## 30. Template Modification Checklist

Before modifying a template, verify:

- Canonical `PortfolioData` is still used
- The change is presentation-focused
- The template remains responsive
- Portfolio theme remains isolated from app-shell theme
- The definition contract remains valid
- Registry registration remains correct
- Version compatibility is intentional
- Example profiles remain valid
- Card preview remains representative
- Published portfolios are not unexpectedly broken
- Export compatibility is preserved
- The template remains portable

---

## 31. New Template Checklist

```text
[ ] Create template directory
[ ] Implement full portfolio template
[ ] Implement responsive behavior
[ ] Implement compact card preview
[ ] Add template definition
[ ] Add example profiles
[ ] Register template
[ ] Verify stable template ID
[ ] Verify template version
[ ] Verify canonical PortfolioData compatibility
[ ] Verify portfolio theme compatibility
[ ] Verify full preview
[ ] Verify responsive preview
[ ] Verify compact card rendering
[ ] Verify portable dependency boundary
[ ] Verify catalog/registry validation
[ ] Verify lazy-loaded resolution renders loading/failure states correctly
[ ] Verify only MVP sections are required (no CUSTOM/Blogs/Testimonials dependency)
```

---

## 32. Strict Prohibitions

Implementation agents must not:

- Create a new portfolio data shape inside an individual template
- Fetch API data directly inside templates
- Access database models from templates
- Add scattered `if (templateId)` rendering logic
- Ignore `templateVersion` where version-aware resolution is required
- Duplicate full templates for preview and public pages
- Create separate user-data and example-data template implementations
- Put preview controls inside templates
- Treat example profiles as real user portfolio records
- Recreate template visuals manually in dashboard or onboarding
- Bypass the Template Registry for normal resolution
- Bypass `PortfolioRenderer` for normal full rendering
- Couple templates to Foliora dashboard/app-shell infrastructure
- Couple templates directly to services, stores, databases, or authentication
- Invent draft/publish lifecycle rules inside template code
- Add speculative `TemplateCapabilities` without a real consumer
- Eagerly load every full template implementation on initial application load
- Require MVP templates to render `CUSTOM`, Blogs, or Testimonials sections

Any exception must be an explicit architectural decision.

---

## 33. Final Implementation Principle

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

**One data contract.  
One rendering system.  
One version-aware registry.  
Many portable templates.  
Many experiences.**
