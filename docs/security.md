# Security

## Purpose

This document defines the security architecture, authentication strategy, authorization rules, and secure development practices for Foliora.

Its purpose is to ensure every feature is implemented with security as a fundamental requirement rather than an afterthought.

This document explains how Foliora secures user accounts, API endpoints, authentication flows, and sensitive data.

---

# Security Philosophy

Security is a core architectural concern.

Every feature should assume that incoming requests and user input are untrusted.

Security should be:

- Secure by default
- Consistent
- Layered
- Maintainable
- Scalable

Every implementation should follow the principle of least privilege.

---

# Authentication

Foliora supports:

- Email & Password
- Google OAuth
- GitHub OAuth

Authentication uses:

- JWT Access Tokens
- Refresh Token Rotation
- HTTP-only Cookies

Passwords are never stored in plain text.

---

# JWT Strategy

Authentication uses two tokens.

## Access Token

Purpose:

Authenticate API requests.

Characteristics:

- Short-lived
- Sent in Authorization header
- Stateless

Default lifetime:

```
15 minutes
```

---

## Refresh Token

Purpose:

Issue new access tokens.

Characteristics:

- Long-lived
- Stored in HTTP-only cookie
- Rotated on every refresh
- Stored hashed in the database

Default lifetime:

```
7 days
```

Refresh tokens should never be accessible through JavaScript.

---

# Refresh Token Rotation

Every refresh request should:

1. Verify the existing refresh token.
2. Invalidate the previous refresh token.
3. Generate a new access token.
4. Generate a new refresh token.
5. Store the new refresh token.
6. Send the new refresh token as an HTTP-only cookie.

Only one active refresh token should exist per user session.

---

# Password Security

Passwords must:

- Be hashed using bcrypt.
- Never be logged.
- Never be returned by APIs.
- Never be stored in plain text.

Password verification should use bcrypt comparison.

---

# Cookie Strategy

Refresh tokens use cookies with:

- HTTP-only
- Secure (production)
- SameSite=Lax
- Appropriate expiration

Access tokens are not stored in cookies.

---

# OAuth

Supported providers:

- Google
- GitHub

OAuth users should still exist in the User table.

Application logic should not depend on the authentication provider.

---

# Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> Is the user allowed to perform this action?

Authorization uses:

- JwtAuthGuard
- RolesGuard

Current roles:

- USER
- ADMIN

Roles define administrative permissions only.

Subscription plans are not roles.

---

# Subscription Authorization

Subscription plans determine feature availability.

Current plans:

- FREE
- PRO

Examples of premium features:

- Premium portfolio templates
- Analytics
- Custom domains
- Future AI features

Subscription checks belong inside services.

Guards should only determine whether a request may proceed.

---

# Input Validation

Every request must be validated.

Frontend validation improves user experience.

Backend validation is the final authority.

Never trust client input.

---

# SQL Injection Prevention

Database access uses Prisma ORM.

Never construct SQL queries manually unless absolutely necessary.

Always use Prisma's query builder.

Avoid raw SQL whenever possible.

---

# XSS Prevention

Prevent Cross-Site Scripting by:

- Escaping untrusted content
- Sanitizing rich text where required
- Avoiding dangerous HTML rendering

Never trust user-generated content.

---

# CSRF

Refresh tokens are stored in HTTP-only cookies.

Use appropriate SameSite cookie settings.

If future features require cross-site requests, evaluate additional CSRF protection.

---

# Rate Limiting

Authentication endpoints should be rate limited.

Examples:

- Login
- Register
- Password Reset

Future API rate limiting may be introduced for public endpoints.

---

# Secrets Management

Secrets must never be committed to version control.

Examples:

- JWT Secret
- OAuth Credentials
- Database URL
- Payment Gateway Keys

Secrets should be loaded through environment variables.

Access them through NestJS ConfigService.

---

# Environment Variables

Environment-specific configuration belongs in:

```
.env
```

Examples:

```
DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

GITHUB_CLIENT_ID

GITHUB_CLIENT_SECRET
```

Never expose secrets to the frontend.

---

# File Upload Security

Uploaded files should be validated.

Validate:

- File type
- File size
- Allowed extensions

Reject unsupported file formats.

Future virus scanning may be introduced.

---

# Error Security

Error messages should help users without exposing implementation details.

Good:

```
Invalid email or password.
```

Avoid:

```
Prisma error P2002...

SQL constraint failed...

Stack trace...
```

Internal errors should only appear in logs.

---

# Logging

Never log:

- Passwords
- Tokens
- Secrets
- Payment information

Logs should contain enough information for debugging without exposing sensitive data.

---

# Security Best Practices

Follow these principles:

- Least privilege
- Defense in depth
- Secure defaults
- Validate every request
- Authenticate before authorization
- Hash sensitive credentials
- Rotate refresh tokens
- Protect secrets
- Keep dependencies updated

---

# Anti-Patterns

Avoid:

- Plain text passwords
- Long-lived access tokens
- LocalStorage refresh tokens
- Exposing secrets
- Raw SQL
- Skipping validation
- Trusting frontend validation
- Returning stack traces
- Logging sensitive data

---

# Summary

Security is a fundamental part of Foliora's architecture.

Every authentication flow, API endpoint, database operation, and user interaction should follow the standards defined in this document.

When in doubt:

- Validate input.
- Authenticate users.
- Authorize actions.
- Protect secrets.
- Keep sensitive data private.
- Prefer secure defaults.
