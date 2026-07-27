# Development Workflow

## Purpose

This document defines the development process, collaboration workflow, Git conventions, code review standards, and engineering practices used throughout Foliora.

Its purpose is to ensure every feature is designed, implemented, reviewed, and maintained consistently.

This document describes **how Foliora is developed**, not how the application works.

---

# Development Philosophy

Foliora is developed as a production-grade SaaS application.

Every feature should prioritize:

- Maintainability
- Readability
- Scalability
- Security
- User Experience
- Consistency

Quick solutions that compromise long-term quality should be avoided.

---

# Team Roles

Development follows a collaborative workflow involving three participants.

## Product Architect (ChatGPT)

Responsible for:

- Product planning
- System architecture
- Database design
- API design
- Security decisions
- Engineering standards
- Documentation
- Code review
- Technical decision making

ChatGPT defines the architecture.

---

## Implementation Engineer (Claude)

Responsible for:

- Implementing approved features
- Writing production-ready code
- Following project documentation
- Following existing coding standards
- Respecting architectural decisions

Claude should implement architecture, not invent it.

---

## Product Owner (Developer)

Responsible for:

- Product vision
- Feature prioritization
- UI approval
- Testing
- Git management
- Deployment
- Final technical decisions

---

# Feature Development Workflow

Every feature follows the same lifecycle.

```
Feature Idea

↓

Requirement Discussion

↓

Architecture Planning

↓

UI Design

↓

Documentation Review

↓

Claude Prompt Engineering

↓

Implementation

↓

Code Review

↓

Testing

↓

Git Commit

↓

Deployment
```

Architecture should always be decided before implementation.

---

# UI Development Workflow

UI is designed before coding.

Workflow:

1. Create UI concepts.
2. Review layouts.
3. Iterate until approved.
4. Finalize the design.
5. Use the approved design as the implementation reference.
6. Claude implements the UI.

The approved UI design is the visual source of truth.

---

# AI Collaboration Workflow

Before requesting implementation, Claude should receive:

- Relevant documentation
- UI reference (if applicable)
- Feature requirements
- Clear implementation scope

Claude should not:

- Invent architecture
- Change folder structures
- Replace approved libraries
- Introduce unnecessary abstractions

If documentation conflicts with implementation, the documentation takes precedence.

---

# Git Workflow

Follow a feature-based workflow.

Branch naming:

```
feature/auth

feature/dashboard

feature/portfolio-editor

fix/login-validation

refactor/api-service
```

Keep branches focused on a single task.

---

# Commit Conventions

Write clear, descriptive commit messages.

Examples:

```
feat: add portfolio editor

feat: implement Google OAuth

fix: resolve refresh token rotation

refactor: simplify authentication flow

docs: update backend architecture

style: improve dashboard layout

test: add auth service tests
```

Avoid vague messages such as:

```
update

changes

fix

done
```

---

# Code Review Checklist

Before accepting any implementation, verify:

- Architecture follows documentation.
- No business logic exists in controllers.
- Components remain reusable.
- TypeScript types are correct.
- Validation is implemented.
- Error handling is consistent.
- Security practices are followed.
- Naming conventions are respected.
- Duplicate logic is avoided.

Code quality is more important than implementation speed.

---

# Testing Expectations

Every completed feature should be tested.

Verify:

- Happy path
- Validation
- Error handling
- Authentication
- Authorization
- Responsive layout
- Accessibility

Major features should be tested before merging.

---

# Refactoring

Refactoring is encouraged when it:

- Improves readability
- Reduces duplication
- Simplifies architecture
- Improves maintainability

Avoid refactoring solely for personal preference.

---

# Documentation Updates

Update documentation whenever architectural decisions change.

Do not modify documentation for minor implementation details.

Documentation should remain the single source of truth.

---

# Pull Request Expectations

Every feature should:

- Solve one problem
- Follow project standards
- Pass testing
- Respect existing architecture

Large unrelated changes should be split into separate pull requests.

---

# Engineering Principles

When making implementation decisions, prioritize:

1. Simplicity
2. Readability
3. Maintainability
4. Security
5. Performance
6. Reusability

Avoid unnecessary abstraction.

Prefer explicit code over clever code.

---

# Definition of Done

A feature is considered complete when:

- Requirements are satisfied.
- Architecture is respected.
- Code is production-ready.
- Validation is implemented.
- Errors are handled.
- Responsive behavior is verified.
- Accessibility is considered.
- Documentation remains accurate.
- Code review is completed.
- Changes are committed.

---

# Anti-Patterns

Avoid:

- Implementing features without planning.
- Changing architecture during implementation.
- Massive pull requests.
- Large files with multiple responsibilities.
- Duplicate logic.
- Skipping validation.
- Ignoring documentation.
- Premature optimization.
- Introducing new libraries without approval.

---

# Summary

Foliora is developed through a documentation-first, architecture-driven workflow.

Every feature should follow the same process:

- Plan before building.
- Design before coding.
- Review before merging.
- Document architectural changes.
- Maintain consistency throughout the project.

The objective is not simply to build features, but to build a cohesive, maintainable, and production-ready SaaS platform.
