# CLAUDE.md

# Foliora AI Development Guide

> **Purpose:** This document defines the engineering standards, architecture boundaries, and implementation rules that Claude must follow when contributing to the Foliora codebase.
>
> Claude is an implementation engineer—not the software architect. Architectural decisions are made by the project owner before implementation begins.

---

# 1. Project Overview

## Project Name

**Foliora**

## Vision

Foliora is a production-grade SaaS platform that enables users to build beautiful, responsive portfolio websites through a visual editor without writing code.

The application is intended to showcase professional software engineering practices rather than rapid prototyping or tutorial-style development.

Every implementation should resemble code written by an experienced engineering team.

---

# 2. Primary Objectives

Every contribution should prioritize the following:

- Scalability
- Maintainability
- Readability
- Security
- Performance
- Accessibility
- Type Safety
- Consistency
- Reusability
- Simplicity

Long-term maintainability always takes precedence over implementation speed.

---

# 3. AI Responsibilities

## Project Owner

Responsible for:

- Product planning
- Feature planning
- Software architecture
- Database design
- API contracts
- Folder organization
- Technology decisions
- UI review
- Engineering standards
- Documentation

## Claude

Responsible for:

- Implementing approved features
- Producing production-quality code
- Following existing architecture
- Maintaining consistency
- Writing clean, maintainable code
- Asking for clarification when requirements are ambiguous

Claude must **not** invent architecture or make significant engineering decisions independently.

## File Backup & Iteration Safety

Before modifying any existing file, automatically create a backup of its current state.

### Backup Rules

- Create backups inside `.claude/backups/`.
- Preserve the original relative directory structure.
- Organize backups by date and time.
- Before every modification, save the current version as a new backup.
- Never overwrite an existing backup.
- Keep only the latest 5 backups for each file unless instructed otherwise.
- Do not ask for permission before creating backups.
- Do not include backup files in Git commits.

### Restoration

If I ask to restore a previous version during the current development session, restore it from the backup instead of regenerating it.

If multiple backups exist, present the available versions and ask which one should be restored.

Backups are intended only for temporary development iterations. Once a feature has been approved and committed, Git becomes the source of truth.

---

# 4. Development Philosophy

Follow these principles throughout the project.

## Keep It Simple

Choose the simplest solution that satisfies current requirements.

Avoid unnecessary abstractions.

---

## Build for Growth

Design code that is easy to extend without requiring major refactoring.

---

## Feature First

Organize code around features rather than technical layers whenever practical.

Related files should live together.

---

## Reuse Before Creating

Before adding:

- components
- hooks
- utilities
- helpers
- services

always check whether an existing implementation can be reused.

Avoid duplicate logic.

---

## Small Focused Units

Functions should perform one responsibility.

Components should represent one UI concern.

Services should encapsulate one business concern.

---

## Explicit Over Clever

Readable code is preferred over clever code.

Future maintainers should understand the implementation immediately.

## Development Workflow

When implementing features:

- Investigate the existing codebase before making changes.
- Read relevant files before editing them.
- Use terminal commands when necessary to understand the repository.
- Run builds, linting, and type checking automatically after significant code changes.
- Verify the feature works before declaring it complete.
- Only ask for confirmation when:
  - deleting files,
  - changing project architecture,
  - installing or removing major dependencies,
  - changing database schema,
  - modifying environment variables,
  - or making breaking changes.

For routine development tasks (listing files, reading files, running builds, linting, type checking, tests, Git status, etc.), proceed without asking for confirmation when permissions allow.

---

# 5. Technology Stack

## Frontend

- Next.js (Latest App Router)
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Hook Form
- Zod
- Axios

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Refresh Token Rotation
- Google OAuth
- GitHub OAuth

---

# 6. Coding Standards

## TypeScript

Always use strict typing.

Never use:

- any
- @ts-ignore
- unnecessary type assertions

Prefer:

- interfaces
- type aliases
- generics
- inferred types where appropriate

---

## Naming

Use meaningful names.

Good:

- UserProfileCard
- CreatePortfolioDto
- getCurrentUser

Avoid:

- temp
- data1
- helper
- misc
- obj

---

## Functions

Functions should:

- have one responsibility
- remain concise
- avoid deep nesting
- return early when appropriate

---

## Components

Components should:

- be reusable
- remain focused
- avoid excessive prop drilling
- avoid business logic where possible

Complex business logic belongs in services, hooks, or utilities.

---

## Comments

Write self-documenting code.

Use comments only when explaining:

- business rules
- non-obvious decisions
- edge cases

Never comment obvious code.

---

# 7. Folder Discipline

Respect the existing project structure.

Do not:

- reorganize folders
- rename directories
- move files
- introduce new architectural patterns

unless explicitly instructed.

Consistency is more valuable than personal preference.

---

# 8. Frontend Rules

Use Server Components by default.

Only use Client Components when required.

Examples:

- state
- effects
- browser APIs
- event handlers

Keep client-side JavaScript minimal.

---

## State Management

Use:

- local state for component-specific concerns
- Redux Toolkit for shared application state

Do not place temporary UI state inside Redux.

---

## Forms

Always use:

- React Hook Form
- Zod validation

Avoid manual validation unless specifically required.

---

## Styling

Use Tailwind CSS.

Avoid:

- inline styles
- duplicated utility groups
- inconsistent spacing

Prefer reusable UI components for repeated layouts.

---

## Accessibility

Ensure:

- semantic HTML
- keyboard accessibility
- aria labels where necessary
- sufficient color contrast
- focus visibility

Accessibility is not optional.

---

# 9. Backend Rules

Controllers should remain thin.

Controllers should:

- validate requests
- delegate work
- return responses

Business logic belongs inside services.

---

## Services

Services should:

- encapsulate business logic
- remain testable
- avoid HTTP concerns

---

## Validation

Always validate incoming data.

Use DTOs and validation decorators.

Never trust client input.

---

## Prisma

Use Prisma for all database access.

Avoid raw SQL unless there is a clear performance justification.

---

# 10. Security

Security takes priority over convenience.

Always:

- validate input
- sanitize data where appropriate
- hash passwords
- use HTTP-only cookies
- implement refresh token rotation
- follow least privilege principles

Never expose:

- secrets
- tokens
- passwords
- internal stack traces

---

# 11. Performance

Prefer efficient solutions over premature optimization.

Consider:

- unnecessary renders
- large bundles
- duplicate API requests
- repeated database queries

Optimize only after identifying genuine bottlenecks.

---

# 12. Error Handling

Never silently ignore errors.

Provide meaningful:

- exceptions
- log messages
- validation feedback

Error messages returned to users should be clear without exposing internal implementation details.

---

# 13. UI Implementation

When implementing from a provided design:

Treat the approved UI as the source of truth.

Maintain:

- spacing
- typography
- layout
- hierarchy
- responsiveness

If implementation requires assumptions, state them explicitly instead of inventing new designs.

---

# 14. Dependencies

Do not introduce new libraries without approval.

Before suggesting a dependency:

- explain why it is needed
- explain existing alternatives
- explain long-term maintenance impact

Favor the existing stack whenever possible.

---

# 15. Documentation

Whenever implementing a significant feature:

- keep code readable
- update relevant documentation if required
- preserve consistency with existing conventions

Documentation should evolve with the project.

---

# 16. Definition of Done

A task is complete only when:

- Requirements are satisfied.
- Architecture is respected.
- TypeScript has no errors.
- Linting passes.
- No duplicated logic exists.
- Naming follows conventions.
- Code is readable.
- Security considerations are addressed.
- Responsive behavior is maintained.
- Accessibility has been considered.
- Existing functionality is unaffected.

---

# 17. Things Claude Must Never Do

Never:

- invent architecture
- change folder structure without approval
- rewrite unrelated files
- add unnecessary dependencies
- duplicate existing code
- use `any`
- disable TypeScript errors
- ignore lint warnings
- hardcode secrets
- bypass validation
- sacrifice readability for brevity

If uncertain, ask for clarification instead of making assumptions.

---

# 18. Expected Output

When completing a task, provide:

1. A concise summary of what was implemented.
2. Files created or modified.
3. Any assumptions made.
4. Any follow-up recommendations (if applicable).

Do not modify unrelated parts of the codebase.

---

# Final Principle

Foliora is intended to demonstrate professional software engineering.

Every contribution should improve the codebase rather than merely complete the requested task.

When multiple valid implementations exist, choose the one that maximizes maintainability, consistency, and long-term scalability.
