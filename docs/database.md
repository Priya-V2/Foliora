# Database

## Purpose

This document defines the database architecture, schema conventions, and data modeling guidelines for Foliora.

Its purpose is to ensure every Prisma model, relationship, migration, and database operation follows a consistent structure.

This document explains **how data should be modeled and managed**, not how PostgreSQL or Prisma work.

Detailed backend implementation is documented separately in:

- `backend.md`
- `api.md`
- `security.md`

---

# Database Philosophy

The database is the source of truth for persistent application data.

Database design should prioritize:

- Data integrity
- Consistency
- Scalability
- Performance
- Simplicity
- Maintainability

Relationships should be modeled explicitly rather than duplicated.

---

# Technology Stack

Foliora uses:

- PostgreSQL
- Prisma ORM

PostgreSQL provides a reliable relational database suitable for a production SaaS.

Prisma provides:

- Type-safe queries
- Schema management
- Migrations
- Transactions
- Excellent TypeScript integration

---

# Schema Organization

All database models are defined inside:

```
prisma/schema.prisma
```

As the project grows, Prisma schemas may be split into multiple files if supported by the chosen workflow.

Keep models organized and readable.

---

# Naming Conventions

## Models

Use PascalCase.

Example:

```
User
Portfolio
Template
Subscription
Analytics
```

---

## Fields

Use camelCase.

Example:

```
createdAt
updatedAt
firstName
portfolioId
```

---

## Tables

Prisma will map models to PostgreSQL tables.

Avoid manually renaming tables unless required.

---

# Relationships

Prefer explicit relationships.

Examples:

```
User

↓

Portfolio

↓

Projects
```

Use foreign keys rather than duplicated data.

Avoid storing the same information in multiple tables.

## Cascading Strategy

Relationships should explicitly define delete behavior.

Use cascading deletes only when child records have no meaning without their parent.

Examples:

- Deleting a portfolio may delete its associated sections.
- Deleting a user should not automatically delete billing history unless explicitly intended.

Choose cascade behavior deliberately rather than relying on defaults.

---

# Primary Keys

Every model should have:

```prisma
id String @id @default(cuid())
```

unless there is a strong reason to use another identifier.

---

# Timestamps

Every persistent model should include:

```prisma
createdAt DateTime @default(now())

updatedAt DateTime @updatedAt
```

These fields should exist unless there is a specific reason to omit them.

---

# Prisma Usage

Prisma is the only way the application communicates with PostgreSQL.

Request flow:

```
Controller

↓

Service

↓

PrismaService

↓

Database
```

Controllers should never access Prisma directly.

---

# Transactions

Use Prisma transactions whenever multiple related operations must either succeed together or fail together.

Examples:

- User registration
- Portfolio publishing
- Subscription activation
- Payment processing

Use:

```ts
prisma.$transaction();
```

when appropriate.

---

# Indexes

Create indexes for fields that are:

- Frequently searched
- Frequently filtered
- Frequently sorted
- Frequently joined

Examples:

- email
- username
- portfolioSlug

Avoid unnecessary indexes.

Indexes improve reads but increase write cost.

---

# Constraints

Use database constraints whenever appropriate.

Examples:

- Unique email
- Unique username
- Required foreign keys

Business rules should not rely solely on application logic.

The database should enforce critical integrity rules.

---

# Migration Workflow

All schema changes should use Prisma migrations.

Typical workflow:

```
Update schema.prisma

↓

Generate migration

↓

Review migration

↓

Apply migration

↓

Commit migration files
```

Never modify production databases manually.

---

# Data Integrity

Maintain consistency through:

- Foreign keys
- Constraints
- Transactions
- Validation

Never allow orphaned records.

---

# Soft Delete Strategy

Foliora uses soft deletes selectively rather than universally.

Soft deletes are applied only to data that represents user-created content or important business entities where accidental deletion could result in data loss.

Soft-deletable models should include:

```prisma
deletedAt DateTime?
```

Instead of permanently deleting records, the application should set `deletedAt` to the current timestamp.

Active records are identified by:

```ts
where: {
  deletedAt: null;
}
```

All queries for soft-deletable models should exclude deleted records unless explicitly requested.

---

## Models Using Soft Delete

The following models should use soft delete:

- User
- Portfolio
- Project
- Experience
- Education
- Certification
- Skill
- SocialLink
- CustomDomain (if implemented)
- UploadedAsset (future)

These models represent user-generated content that users may accidentally delete and later wish to restore.

---

## Models Using Permanent Delete

The following models should always use permanent deletion:

- RefreshToken
- VerificationToken
- PasswordResetToken
- OAuthState
- Session (if implemented)

These models contain temporary system data and provide no value after expiration or revocation.

---

## Business Records

Business records should generally not be deleted.

Examples:

- Subscription
- Payment
- Invoice

These records are important for billing history, auditing, financial reporting, and customer support.

If business requirements later allow deletion, it should follow a defined data-retention policy rather than immediate removal.

---

## Design Principles

When deciding whether a model should use soft delete, ask:

- Is this user-created content?
- Would accidental deletion cause meaningful data loss?
- Would customer support need to restore it?

If the answer is yes, prefer soft delete.

Otherwise, use permanent deletion unless business or legal requirements dictate otherwise.

---

# Performance

General principles:

- Select only required fields
- Avoid unnecessary queries
- Use indexes appropriately
- Use transactions when required
- Avoid N+1 query patterns

Optimize based on measurement rather than assumptions.

---

# Reusability Rules

Database access belongs inside backend services.

Do not duplicate database queries across multiple services.

Extract shared query logic when appropriate.

Keep Prisma usage consistent throughout the project.

---

# Anti-Patterns

Avoid:

- Raw SQL without justification
- Duplicate data
- Missing indexes on frequently queried fields
- Database access inside controllers
- Large unnecessary transactions
- Storing derived data unnecessarily
- Manual schema changes outside Prisma migrations

---

# Summary

The database architecture of Foliora is designed to provide a reliable, maintainable, and scalable foundation for the application.

Every model, relationship, migration, and query should follow the conventions defined in this document.

When in doubt:

- Model relationships explicitly.
- Prefer normalization over duplication.
- Use Prisma for all database access.
- Protect data integrity with constraints and transactions.
- Keep the schema simple and maintainable.
