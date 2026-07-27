# API

## Purpose

This document defines the API design standards, conventions, and communication patterns used throughout Foliora.

Its purpose is to ensure every endpoint follows a predictable and consistent structure.

This document explains **how APIs should be designed**, not the implementation details of individual features.

Feature-specific endpoints should be documented separately when required.

---

# API Philosophy

Foliora follows RESTful API principles.

Every endpoint should be:

- Predictable
- Consistent
- Stateless
- Secure
- Versioned
- Easy to consume

The API should expose resources rather than actions.

HTTP methods and status codes should communicate the outcome of every request.

---

# Base URL

All endpoints are versioned.

```text
/api/v1
```

Examples:

```text
/api/v1/auth/login

/api/v1/users/me

/api/v1/portfolios

/api/v1/templates
```

Future breaking changes should introduce a new version.

Example:

```text
/api/v2
```

---

# Route Naming

Routes should represent resources rather than actions.

Good examples:

```text
GET    /users/me

PATCH  /users/me

GET    /portfolios

GET    /portfolios/:id

POST   /portfolios

PATCH  /portfolios/:id

DELETE /portfolios/:id

GET    /templates

POST   /templates
```

Avoid verbs in route names.

Avoid:

```text
/createPortfolio

/updatePortfolio

/deletePortfolio

/getUser
```

Use nouns whenever possible.

---

# HTTP Methods

Use HTTP methods according to their intended purpose.

| Method | Purpose                                  |
| ------ | ---------------------------------------- |
| GET    | Retrieve resources                       |
| POST   | Create resources                         |
| PATCH  | Partially update resources               |
| PUT    | Replace an entire resource (rarely used) |
| DELETE | Delete resources                         |

Prefer `PATCH` over `PUT` unless replacing an entire resource.

---

# Request Validation

All incoming requests must be validated.

Validation uses:

- class-validator
- class-transformer

Validation should occur before business logic executes.

Never trust client-side validation.

---

# Request DTOs

Every endpoint receiving input should use DTOs.

Examples:

```text
LoginDto

SignupDto

CreatePortfolioDto

UpdatePortfolioDto
```

Avoid inline request validation.

---

# Response Format

Successful responses should return the requested resource directly.

Example:

```json
{
  "id": "clxyz123",
  "title": "My Portfolio",
  "slug": "priya"
}
```

Collections should return arrays.

Example:

```json
[
  {
    "id": "1",
    "title": "Portfolio A"
  },
  {
    "id": "2",
    "title": "Portfolio B"
  }
]
```

Do not wrap responses in custom objects such as:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

HTTP status codes already communicate success or failure.

UI messages should be handled by the frontend.

---

# Error Responses

Successful responses should return the requested resource directly.

Failed requests should return meaningful error responses using NestJS exceptions.

Example:

```json
{
  "statusCode": 404,
  "message": "Portfolio not found",
  "error": "Not Found"
}
```

Validation errors should clearly describe invalid fields.

Database errors should never be exposed directly to clients.

Technical exceptions should be translated into user-friendly business messages.

Examples:

- "Email already exists"
- "Portfolio not found"
- "You have reached the free plan portfolio limit."

Do not expose:

- Stack traces
- SQL queries
- Prisma error codes
- Internal implementation details

# Status Codes

Use standard HTTP status codes consistently.

| Status | Meaning                           |
| ------ | --------------------------------- |
| 200    | Success                           |
| 201    | Resource created                  |
| 204    | No content                        |
| 400    | Bad request                       |
| 401    | Unauthorized                      |
| 403    | Forbidden                         |
| 404    | Resource not found                |
| 409    | Conflict                          |
| 422    | Validation failed (if applicable) |
| 500    | Internal server error             |

Do not misuse status codes.

---

# Authentication

Protected endpoints require authentication.

Authentication uses:

- JWT Access Token
- Refresh Token Rotation
- HTTP-only Cookies

Authentication is handled by `JwtAuthGuard`.

Public endpoints should not require authentication.

Examples:

```text
POST /auth/login

POST /auth/register

POST /auth/refresh
```

Protected endpoints:

```text
GET /users/me

PATCH /users/me

POST /portfolios
```

---

# Authorization

Authorization determines whether an authenticated user may access a resource.

Administrative endpoints should use `RolesGuard`.

Current roles:

- USER
- ADMIN

Roles determine administrative permissions only.

Subscription plans should never be implemented as roles.

Business rules remain inside services.

---

# Pagination

Collection endpoints should support pagination.

Example:

```text
GET /portfolios?page=1&limit=10
```

Default pagination values should be reasonable.

Avoid returning excessively large datasets.

---

# Filtering

Filtering should use query parameters.

Example:

```text
GET /templates?category=developer

GET /portfolios?visibility=public
```

Keep filtering predictable and RESTful.

---

# Sorting

Sorting should also use query parameters.

Example:

```text
GET /templates?sort=name

GET /portfolios?sort=createdAt
```

Sorting direction:

```text
GET /templates?sort=createdAt&order=desc
```

Supported values:

- asc
- desc

---

# Searching

Searching should use query parameters.

Example:

```text
GET /templates?search=react
```

Search endpoints should remain consistent across the application.

---

# File Uploads

File uploads should use:

```
multipart/form-data
```

Examples:

- Profile images
- Portfolio assets
- Future media uploads

File validation should occur before storage.

---

# API Versioning

All APIs begin with:

```text
/api/v1
```

Breaking changes should create a new version.

Avoid modifying existing versions in incompatible ways.

---

# Naming Conventions

Use plural nouns for resource collections.

Examples:

```text
/users

/portfolios

/templates

/subscriptions
```

Avoid abbreviations.

Keep endpoint names descriptive and predictable.

---

# API Design Principles

Every endpoint should satisfy the following principles:

- One clear responsibility
- Consistent naming
- Proper HTTP method
- Proper status code
- Validation before execution
- Authentication where required
- Authorization where required
- Thin controllers
- Business logic inside services

---

# Reusability Rules

Avoid duplicate endpoints.

Prefer extending existing resources instead of introducing similar routes.

Shared functionality should remain inside services.

---

# Anti-Patterns

Avoid:

- Verbs in route names
- Inconsistent endpoint naming
- Custom response wrappers
- Returning stack traces
- Business logic inside controllers
- Skipping validation
- Ignoring HTTP status codes
- Breaking API changes without versioning

---

# Summary

Foliora's API is designed to be predictable, RESTful, and easy to consume.

Every endpoint should follow the standards defined in this document to ensure consistency across the platform.

When in doubt:

- Use REST conventions.
- Use proper HTTP methods.
- Validate all input.
- Return resources directly.
- Use standard HTTP status codes.
- Keep controllers thin.
- Keep business logic inside services.
