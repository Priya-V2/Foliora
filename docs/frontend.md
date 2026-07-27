# Frontend

## Purpose

This document defines the frontend architecture, development standards, and implementation guidelines for Foliora.

Its purpose is to ensure every page, component, layout, hook, and feature follows a consistent architecture and coding style.

This document explains **how frontend code should be written**, not how React or Next.js work.

Detailed UI design decisions are documented separately in `ui-guidelines.md`.

---

# Frontend Philosophy

The frontend should prioritize:

- Simplicity
- Reusability
- Consistency
- Accessibility
- Performance
- Type Safety
- Maintainability

Every component should have a single responsibility.

Business logic should remain on the backend whenever possible.

The frontend is responsible for:

- Presenting data
- Collecting user input
- Managing client-side interactions
- Calling backend APIs
- Managing application state

---

# Technology Stack

Foliora's frontend uses:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Hook Form
- Zod
- Axios

These technologies are the standard throughout the project.

Do not introduce alternative libraries unless explicitly approved.

---

# Frontend Folder Structure

```text
client/
└── src/
    ├── app/
    ├── components/
    │   ├── ui/
    │   └── layout/
    ├── features/
    ├── hooks/
    ├── services/
    ├── store/
    ├── lib/
    ├── utils/
    ├── types/
    ├── constants/
    └── styles/
```

Each folder has a clearly defined responsibility.

---

## app/

Contains Next.js App Router files.

Examples:

- Routes
- Layouts
- Loading UI
- Error UI
- Route Groups

Keep pages lightweight.

Pages should primarily compose feature components rather than contain large amounts of UI.

---

## components/

Contains reusable components shared across multiple features.

### ui/

Reusable UI building blocks.

Examples:

```
Button
Input
Card
Modal
Dialog
Badge
Avatar
Table
Spinner
Skeleton
```

These components should never contain business logic.

---

### layout/

Reusable layout components.

Examples:

```
Header
Sidebar
Footer
Container
DashboardLayout
```

Layout components provide page structure and should remain generic.

---

## features/

Contains feature-specific frontend code.

Examples:

```text
features/

home/
├── components/
└── index.tsx

auth/
├── components/
├── hooks/
└── index.tsx

portfolio/
├── components/
├── hooks/
└── index.tsx

dashboard/
├── components/
└── index.tsx
```

Keep code as close as possible to the feature that owns it.

Promote code to shared folders only when it is reused by multiple features.

Avoid creating unnecessary folders.

---

## hooks/

Contains reusable hooks shared across multiple features.

Examples:

```
useDebounce.ts
useMediaQuery.ts
useLocalStorage.ts
usePagination.ts
```

Feature-specific hooks should remain inside their feature.

Example:

```
features/auth/hooks/useLogin.ts
```

---

## services/

Contains shared API communication logic.

Examples:

```
auth.service.ts
portfolio.service.ts
user.service.ts
```

Rules:

- All HTTP communication uses Axios.
- Components should never call Axios directly.
- Pages should never call Axios directly.
- Services should return typed responses.
- Handle API errors consistently.

Flow:

```
Component

↓

Service

↓

Axios

↓

Backend API
```

---

## store/

Contains Redux Toolkit configuration.

Examples:

- Store
- Slices
- Middleware

Redux should contain only shared application state.

---

## lib/

Contains application configuration and third-party library setup.

Examples:

- Axios instance
- Utility library configuration
- Theme configuration

---

## utils/

Contains pure utility functions.

Examples:

```
formatDate()
slugify()
formatCurrency()
```

Do not place business logic here.

---

## types/

Contains shared TypeScript types used across multiple features.

Examples:

```
User.ts
Portfolio.ts
ApiResponse.ts
```

Feature-specific types should remain close to their feature.

---

## constants/

Contains shared application constants.

Examples:

```
Routes
Roles
Theme Constants
```

---

## styles/

Contains global styling resources.

Examples:

- globals.css
- fonts
- animations

Tailwind remains the primary styling solution.

---

# App Router Philosophy

Foliora uses the Next.js App Router.

Use:

- Route Groups
- Nested Layouts
- Loading UI
- Error Boundaries

Prefer Server Components whenever practical.

---

# Rendering Strategy

## Server Components

Server Components are the default.

Use for:

- Static pages
- SEO
- Data fetching
- Dashboard pages
- Read-only views

---

## Client Components

Only use Client Components when necessary.

Examples:

- useState
- useEffect
- Browser APIs
- Event Handlers
- Third-party client libraries

Minimize client-side JavaScript whenever possible.

---

# Component Architecture

Components should:

- Have one responsibility.
- Be reusable when appropriate.
- Remain small and focused.
- Compose other components rather than becoming monolithic.

Organize components into:

### Shared Components

Reusable UI.

Examples:

```
Button
Card
Input
Modal
```

---

### Feature Components

Specific to a single feature.

Examples:

```
PortfolioEditor
TemplateGallery
AnalyticsChart
LoginForm
```

---

### Layout Components

Shared page layouts.

Examples:

```
DashboardLayout
Sidebar
Header
Footer
```

---

# State Management

Choose the simplest solution that satisfies the requirement.

---

## Local State

Use for:

- Dialog visibility
- Tabs
- Dropdowns
- Temporary UI state

Example:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

---

## Redux Toolkit

Use for:

- Authentication
- Current User
- Portfolio Editor
- Global Settings
- Shared Application State

Do not store temporary UI state inside Redux.

---

## URL State

Use URL search parameters for:

- Search
- Pagination
- Filters
- Sorting

URL state should remain shareable and bookmarkable.

---

## Server State

Keep server data close to where it is used.

Do not automatically store API responses in Redux.

Only promote server data into Redux when multiple parts of the application genuinely need shared access.

---

# Forms

All forms use:

- React Hook Form
- Zod

Benefits:

- Strong validation
- Better performance
- Cleaner code
- Consistent user experience

Avoid:

- Manual validation
- One useState per field

---

# Validation

Validation exists in two places.

Frontend:

- Better user experience
- Immediate feedback

Backend:

- Final source of truth

Never rely solely on frontend validation.

---

# Styling

Tailwind CSS is the standard styling solution.

Guidelines:

- Mobile-first
- Utility-first
- Consistent spacing
- Responsive layouts

Avoid:

- Inline styles
- CSS Modules
- Styled Components

unless explicitly approved.

---

# Responsive Design

Every page should support:

- Mobile
- Tablet
- Laptop
- Desktop

Always design mobile-first.

---

# Accessibility

Accessibility is required.

Ensure:

- Semantic HTML
- Labels for inputs
- Keyboard navigation
- Visible focus states
- ARIA attributes where appropriate
- Sufficient color contrast

Accessibility should be considered during implementation rather than added later.

---

# Performance

General rules:

- Prefer Server Components
- Lazy-load large features
- Use dynamic imports when appropriate
- Avoid unnecessary re-renders
- Memoize expensive computations only when beneficial

Avoid premature optimization.

---

# Naming Conventions

### Components

```
PortfolioCard.tsx
TemplateGrid.tsx
LoginForm.tsx
```

Use PascalCase.

---

### Hooks

```
useAuth.ts
usePagination.ts
```

Use camelCase prefixed with `use`.

---

### Services

```
auth.service.ts
portfolio.service.ts
```

Use kebab-case with `.service.ts`.

---

### Types

```
User.ts
Portfolio.ts
```

Use PascalCase.

---

Use descriptive names.

Avoid abbreviations.

---

# Reusability Rules

Before creating:

- Component
- Hook
- Utility
- Service

Always determine whether an existing implementation can be reused.

Keep code close to the feature that owns it.

Promote code to shared folders only when it becomes reusable across multiple features.

Avoid duplicate implementations.

---

# Anti-Patterns

Avoid:

- Massive components
- Deep prop drilling
- Business logic inside components
- Direct Axios calls inside pages or components
- Duplicate UI components
- Unnecessary global state
- `useEffect` for data fetching when a Server Component is appropriate
- Premature optimization
- `any` types

---

# Summary

The frontend architecture of Foliora is designed to produce a clean, consistent, maintainable, and scalable user interface.

Every page, component, hook, and service should follow the standards defined in this document to ensure the codebase remains cohesive as the platform grows.

When in doubt:

- Keep components small.
- Keep code close to the feature that owns it.
- Promote code to shared modules only when reuse is justified.
- Prefer simplicity over unnecessary abstraction.
