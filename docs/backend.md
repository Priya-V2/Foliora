# Backend

## Purpose

This document defines the backend architecture, development standards, and implementation guidelines for Foliora.

Its purpose is to ensure every module, controller, service, DTO, guard, and database interaction follows a consistent architecture and coding style.

This document explains **how backend code should be written**, not how NestJS works.

Detailed database design, API contracts, and security implementation are documented separately in:

- `database.md`
- `api.md`
- `security.md`

---

# Backend Philosophy

The backend is the source of truth for the application.

Its responsibilities include:

- Business logic
- Authentication
- Authorization
- Validation
- Database access
- External integrations
- Data integrity

The backend should remain:

- Secure
- Scalable
- Maintainable
- Testable
- Consistent

Controllers should remain thin.

Business logic belongs inside services.

---

# Technology Stack

Foliora's backend uses:

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Refresh Token Rotation
- Google OAuth
- GitHub OAuth

These technologies are the standard throughout the project.

Do not introduce alternative libraries unless explicitly approved.

---

# Backend Folder Structure

```text
server/
└── src/
    ├── auth/
    ├── users/
    ├── portfolio/
    ├── templates/
    ├── analytics/
    ├── billing/
    ├── common/
    │   ├── decorators/
    │   ├── filters/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── pipes/
    │   ├── constants/
    │   └── utils/
    ├── prisma/
    ├── config/
    ├── app.module.ts
    └── main.ts
```

The project follows a feature-first architecture.

Each feature owns its controllers, services, DTOs, and related files.

---

# Feature Module Structure

Each feature should follow a consistent structure.

Example:

```text
portfolio/

portfolio.module.ts

portfolio.controller.ts

portfolio.service.ts

dto/

guards/ (only if required)

types/ (only if required)
```

Avoid creating unnecessary folders.

Only introduce additional folders when the feature becomes large enough to justify them.

---

# Controllers

Controllers handle HTTP requests.

Responsibilities:

- Receive requests
- Validate incoming data
- Call services
- Return responses

Controllers should **never** contain business logic.

Example:

```ts
@Post()
create(@Body() dto: CreatePortfolioDto) {
    return this.portfolioService.create(dto);
}
```

Keep controllers small and focused.

---

# Services

Services contain all business logic.

Examples:

- User registration
- Authentication
- Portfolio creation
- Portfolio publishing
- Template management
- Billing
- Analytics

Services are responsible for enforcing business rules.

Controllers should never duplicate service logic.

---

# DTOs

All request data must use DTOs.

Examples:

- Request Body
- Query Parameters
- Route Parameters

Use:

- class-validator
- class-transformer

Avoid manual validation.

---

# Validation

Validation occurs in two stages.

## Frontend

Provides immediate feedback to the user.

## Backend

Acts as the final source of truth.

Never trust client-side validation.

Always validate requests before business logic executes.

---

# Authentication & Authorization

Foliora separates authentication, authorization, and business rules into distinct responsibilities.

## Authentication

Authentication verifies the identity of the user.

Authentication uses:

- JWT Access Tokens
- Refresh Token Rotation
- HTTP-only Cookies
- JwtAuthGuard

Unauthenticated requests should never reach protected endpoints.

---

## Authorization

Authorization determines whether an authenticated user has permission to access a protected resource.

Administrative endpoints use `RolesGuard`.

Current roles:

- USER
- ADMIN

Roles represent administrative permissions only.

Example:

```text
Request

↓

JwtAuthGuard

↓

RolesGuard

↓

Controller

↓

Service
```

---

## Subscription Plans

Subscription plans are independent of user roles.

Current plans:

- FREE
- PRO

Plans determine feature availability.

Examples:

- Premium Templates
- Analytics
- Custom Domains
- Future AI Features

Plans are **not** roles.

---

## Business Rules

Business rules belong inside services.

Examples:

- Portfolio limits
- Premium feature access
- Export limits
- Custom domain availability
- Analytics generation

Guards determine whether a request may proceed.

Services determine how the application behaves.

---

# Prisma Usage

Prisma is the application's data access layer.

Request flow:

```text
Controller

↓

Service

↓

PrismaService

↓

PostgreSQL
```

Controllers must never access Prisma directly.

All database operations belong inside services.

Avoid raw SQL unless absolutely necessary.

---

# Transactions

Use Prisma transactions whenever multiple related database operations must succeed together.

Example:

- User creation
- Portfolio creation
- Subscription activation

If one operation fails, the transaction should roll back automatically.

---

# Error Handling

Errors should be:

- Predictable
- Consistent
- Secure
- User-friendly

Do not expose internal implementation details.

Use NestJS exceptions.

Examples:

- BadRequestException
- UnauthorizedException
- ForbiddenException
- NotFoundException
- ConflictException

## Business Exceptions

Services should convert technical errors into meaningful business exceptions.

For example:

Instead of exposing:

- Prisma unique constraint errors
- Database exceptions
- Internal implementation details

Throw appropriate NestJS exceptions with user-friendly messages.

Examples:

- ConflictException("Email already exists")
- NotFoundException("Portfolio not found")
- ForbiddenException("Free plan portfolio limit reached")
- UnauthorizedException("Invalid email or password")

---

# Exception Filters

Use centralized exception filters for consistent error responses.

Avoid repetitive try/catch blocks inside controllers.

Unexpected errors should be handled globally.

---

# Guards

Guards are responsible only for request authorization.

Examples:

- JwtAuthGuard
- RolesGuard

Guards should never contain business logic.

They answer one question:

> "Is this request allowed to continue?"

---

# Interceptors

Interceptors should be used for cross-cutting concerns.

Examples:

- Response transformation
- Logging
- Performance monitoring (future)

Avoid placing business logic inside interceptors.

---

# Configuration

Application configuration should use NestJS ConfigService.

Never access environment variables directly inside services.

Good:

```ts
constructor(private readonly configService: ConfigService) {}
```

Avoid:

```ts
process.env.JWT_SECRET;
```

inside business logic.

---

# Logging

Use NestJS Logger.

Avoid:

```ts
console.log();
```

Logging should be meaningful and consistent.

Sensitive information should never be logged.

---

# Naming Conventions

### Controllers

```text
auth.controller.ts
portfolio.controller.ts
```

---

### Services

```text
auth.service.ts
portfolio.service.ts
```

---

### DTOs

```text
login.dto.ts
create-portfolio.dto.ts
```

---

### Guards

```text
jwt-auth.guard.ts
roles.guard.ts
```

---

### Modules

```text
auth.module.ts
portfolio.module.ts
```

Use descriptive names.

Avoid abbreviations.

---

# Reusability Rules

Before creating:

- Guard
- DTO
- Utility
- Service

Determine whether an existing implementation can be reused.

Avoid duplicate business logic.

Keep code close to the feature that owns it.

---

# Anti-Patterns

Avoid:

- Business logic inside controllers
- Database access inside controllers
- Manual request validation
- Direct environment variable access
- Massive services
- Duplicate business logic
- Raw SQL without justification
- `any` types
- Console logging in production code

---

# Summary

The backend architecture of Foliora is designed to produce a secure, maintainable, and scalable API.

Every module, controller, service, DTO, guard, and database interaction should follow the standards defined in this document to ensure the backend remains consistent as the platform grows.

When in doubt:

- Keep controllers thin.
- Keep business logic inside services.
- Keep authorization inside guards.
- Keep database access through Prisma.
- Prefer simplicity over unnecessary abstraction.
