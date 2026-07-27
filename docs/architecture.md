# Architecture

## Purpose

This document defines the architectural vision, engineering principles, system organization, and high-level design of Foliora.

It serves as the primary architectural reference for all contributors, including both human developers and AI assistants. Every architectural decision, implementation, and future enhancement should align with the principles defined in this document.

This document focuses on **what the system looks like and why it is designed that way**. Detailed implementation guidance is documented separately in:

- `frontend.md`
- `backend.md`
- `database.md`
- `api.md`
- `security.md`
- `ui-guidelines.md`

---

# Product Vision

## What is Foliora?

Foliora is a commercial Software-as-a-Service (SaaS) platform that enables developers, designers, students, freelancers, and professionals to create, customize, and publish modern portfolio websites without writing code.

Rather than simply generating portfolio pages, Foliora aims to become an end-to-end platform where users can design, host, manage, analyze, and continuously improve their professional online presence.

The platform is intended to operate as a real business with active users, recurring revenue, continuous product development, and long-term maintainability.

Alongside its commercial objectives, Foliora also serves as a public demonstration of professional software engineering practices, product thinking, and scalable system architecture.

---

# Engineering Goals

Every architectural decision should support one or more of the following goals.

## Scalability

The architecture should allow the platform to grow from a handful of users to thousands of active users without requiring significant redesign.

## Maintainability

The codebase should remain easy to understand, modify, and extend over time.

## Security

Security should be considered from the beginning rather than added as an afterthought.

## Performance

The application should provide a responsive experience while minimizing unnecessary resource usage.

## Type Safety

Strong TypeScript typing should reduce runtime errors and improve developer confidence.

## Reusability

Reusable components, services, utilities, and modules should be preferred over duplicated implementations.

## Consistency

Every feature should follow the same architectural patterns and coding conventions.

## Developer Experience

A well-organized codebase allows both developers and AI assistants to work efficiently.

---

# High-Level System Architecture

Foliora follows a traditional client-server architecture.

```
Browser
    │
    ▼
Next.js Frontend
    │
 REST API
    │
    ▼
NestJS Backend
    │
 Prisma ORM
    │
    ▼
PostgreSQL
```

## Frontend Responsibilities

The frontend is responsible for:

- Rendering the user interface
- Managing client-side interactions
- Form validation
- Authentication state
- Calling backend APIs
- Presenting data

The frontend should never contain business logic that belongs on the server.

---

## Backend Responsibilities

The backend is responsible for:

- Business logic
- Authentication
- Authorization
- Data validation
- Database operations
- File processing
- External service integration

The backend acts as the single source of truth.

---

## Database Responsibilities

The database is responsible for:

- Persistent storage
- Relationships
- Constraints
- Transactions
- Data integrity

Business logic should never exist inside the database.

---

# Repository Structure

```
foliora/

├── client/
├── server/
├── docs/
├── assets/
├── README.md
└── CLAUDE.md
```

## Why Separate Client and Server?

The frontend and backend are maintained as independent applications.

Benefits include:

- Independent deployments
- Easier maintenance
- Better separation of concerns
- Improved scalability
- Cleaner architecture
- Easier future migration to distributed services

---

# Architectural Principles

## Separation of Concerns

Each layer has a clearly defined responsibility.

UI should remain separate from business logic.

Business logic should remain separate from persistence.

---

## Feature-First Organization

The project is organized around features rather than technical layers whenever practical.

Example:

```
auth/
users/
portfolio/
templates/
billing/
```

instead of

```
controllers/
services/
models/
```

Feature-first organization improves discoverability and reduces coupling.

---

## Composition Over Inheritance

Favor composition whenever possible.

Avoid deep inheritance hierarchies.

---

## Reuse Before Creating

Before introducing:

- Components
- Hooks
- Services
- Utilities

always determine whether an existing implementation can be reused.

---

## Explicit Over Clever

Readable code is preferred over clever code.

Future maintainers should understand the implementation without extensive explanation.

---

## Secure by Default

Every feature should assume hostile input.

Validation, authorization, and secure defaults should exist throughout the application.

---

# Request Lifecycle

Every request follows the same general lifecycle.

```
Browser

↓

Next.js UI

↓

API Layer

↓

NestJS Controller

↓

Validation

↓

Authentication

↓

Business Service

↓

Prisma

↓

PostgreSQL

↓

Response

↓

UI Update
```

Controllers remain thin.

Business logic belongs inside services.

---

# Module Boundaries

## Frontend

Responsible for:

- User interface
- Routing
- Forms
- State management
- API communication

---

## Backend

Responsible for:

- Business logic
- Validation
- Authentication
- Authorization
- Database access

---

## Database

Responsible for:

- Data storage
- Relationships
- Constraints
- Transactions

No frontend code should directly access the database.

---

# Dependency Rules

Dependencies should always flow downward.

```
UI

↓

Components

↓

Hooks

↓

API Layer

↓

Backend

↓

Database
```

Lower layers must never depend on higher layers.

Avoid circular dependencies.

Avoid feature modules directly depending on internal implementations of other modules.

---

# Authentication Overview

Foliora supports:

- Email & Password
- Google OAuth
- GitHub OAuth

Authentication uses:

- JWT Access Tokens
- Refresh Token Rotation
- HTTP-only Cookies

Detailed implementation is documented in `security.md`.

---

# Error Handling Philosophy

Errors should be:

- Consistent
- Predictable
- User-friendly
- Secure

Frontend should present meaningful error messages.

Backend should never expose sensitive implementation details.

---

# Performance Philosophy

Performance optimization should focus on measurable improvements rather than premature optimization.

General principles include:

- Server Components by default
- Efficient database queries
- Minimize client-side JavaScript
- Lazy loading where appropriate
- Reusable components
- Avoid unnecessary re-renders

Detailed optimization strategies are documented separately.

---

# Scalability Strategy

The initial architecture is intentionally simple while allowing future expansion.

Planned infrastructure additions include:

- Redis
- Background Job Queue
- Object Storage
- CDN
- Analytics Platform
- Monitoring
- Distributed Services

These services should integrate without requiring major architectural changes.

---

# Future Product Roadmap

The architecture is designed to support future capabilities including:

- Premium subscription plans
- Portfolio templates marketplace
- Custom domains
- Managed hosting
- Analytics dashboard
- Resume builder
- AI-assisted portfolio generation
- Team workspaces
- Public APIs
- Notifications
- Asset management

Current architectural decisions should not limit these future features.

---

# Architecture Decision Philosophy

Every significant engineering decision should answer three questions:

## Why are we doing this?

The problem being solved.

## Why this solution?

The reasoning behind the chosen approach.

## Why not the alternatives?

The trade-offs considered before making the decision.

Architecture decisions should prioritize long-term maintainability over short-term convenience.

---

# Summary

The architecture of Foliora is guided by a simple philosophy:

> Build software that is easy to understand, easy to extend, secure by default, and capable of evolving into a sustainable commercial SaaS platform.

Every future feature should respect the principles documented here to ensure the platform remains consistent, maintainable, and scalable throughout its lifetime.
