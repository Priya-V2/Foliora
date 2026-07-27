# Foliora Product Flow

Version: 1.0

---

# Purpose

This document defines the complete user journey, application flow, navigation architecture,
screen responsibilities, and interactions for Foliora.

This document exists so that:

- Every screen has a clear purpose.
- No UI is designed without understanding its role.
- Claude implements consistent user flows.
- Future features fit naturally into the application.

This document is the source of truth for all UI/UX decisions.

---

# Product Goal

Foliora enables developers to create a professional portfolio in minutes by combining:

- Resume Parsing
- GitHub Project Import
- Manual Editing
- Professional Templates
- Live Preview
- One-click Publishing
- Exportable Source Code

Users should never feel overwhelmed with large forms.

The experience should feel guided, modern and effortless.

---

# User Journey

Visitor

↓

Landing Page

↓

Authentication

↓

Welcome

↓

Resume Upload

↓

GitHub Import (Optional)

↓

Review Imported Data

↓

Choose Template

↓

Portfolio Editor

↓

Preview

↓

Publish

↓

Dashboard

---

# Navigation

## Sidebar

Dashboard

Portfolio

Templates

Preview

Export

Settings

---

## Top Navigation

Notifications

Publish Button

User Profile

---

# Screen Responsibilities

---

# Authentication

Contains

- Login
- Signup
- Forgot Password
- Reset Password

Purpose

Authenticate users.

After successful signup

↓

Redirect to Welcome.

Never redirect new users to Dashboard.

---

# Welcome

Purpose

Introduce Foliora.

Display

Welcome message

Estimated setup time

Three choices

- Upload Resume
- Connect GitHub
- Build Manually

Primary CTA

Upload Resume

---

# Resume Upload

Purpose

Extract portfolio information automatically.

Flow

Upload PDF

↓

Extract

↓

Review

↓

Continue

Extract

- Name
- Summary
- Education
- Experience
- Skills
- Certifications
- Awards
- Contact Information

Show extraction progress.

---

# GitHub Import

Purpose

Import developer profile and projects.

Never automatically import all repositories.

Flow

Connect GitHub

↓

Display repositories

↓

User selects projects

↓

Import

Import

- Avatar
- Bio
- GitHub Username
- Repository Name
- Description
- Languages
- Topics
- Stars

Optional.

Users can skip this step.

---

# Review Imported Data

Purpose

Allow users to verify extracted information.

Users should edit before continuing.

Sections

Personal

Experience

Education

Skills

Projects

Certificates

Social Links

---

# Template Selection

Purpose

Choose an initial portfolio template.

Display

Template Gallery

Filters

Categories

Preview

Apply

Premium templates

Free templates

Premium templates show

Purchase

instead of

Apply

---

# Dashboard

Purpose

Provide an overview of the published portfolio.

Should only be accessible after onboarding.

Display

Portfolio Status

Portfolio Score

Portfolio Health

Public Portfolio

Portfolio Preview

Continue Editing

Recent Activity

Quick Actions

Never display analytics for new users.

---

# Portfolio

Purpose

Edit all portfolio content.

Sections

Hero

About

Projects

Experience

Education

Skills

Certifications

Achievements

Social Links

Contact

Each section should be independent.

Changes are auto-saved.

Avoid giant forms.

---

# Templates

Purpose

Browse and manage templates.

Features

Search

Filters

Categories

Preview

Purchase Premium

Apply

Current Template

Template Categories

Minimal

Modern

Creative

Corporate

Dark

Light

Premium templates

Require purchase before applying.

---

# Preview

Purpose

Preview the portfolio before publishing.

Toolbar

Desktop

Tablet

Mobile

Refresh

Publish

Back

Display

Live portfolio

Users can switch devices without leaving the page.

---

# Publish

Publishing validates

Hero

Projects

Experience

Skills

Contact

If errors exist

Return user to Portfolio Editor.

If valid

Publish portfolio.

---

# Export

Purpose

Allow users to own their portfolio source code.

Frameworks

Next.js (App Router)

React + Vite

Export Includes

Components

Pages

Assets

Tailwind

Responsive Layout

README

Download ZIP

Export should only contain frontend source code.

Backend is never exported.

---

# Settings

Purpose

Manage account and application settings.

Sections

Account

Publishing

Integrations

Notifications

Billing

Account

Profile Picture

Email

Password

Delete Account

Publishing

Portfolio URL

Visibility

Search Indexing

Future

Custom Domain

Integrations

GitHub

Resume

Future

LinkedIn

Dev.to

Medium

Billing

Current Plan

Invoices

Upgrade

Cancel

Notifications

Portfolio Published

Weekly Tips

Security Alerts

Template Updates

---

# Empty States

Dashboard

No Portfolio

↓

Redirect to Welcome.

Projects

No projects

↓

Import from GitHub

or

Create manually

Templates

No purchased premium templates.

Preview

No portfolio

↓

Complete Portfolio first.

Export

Portfolio not published.

↓

Publish first.

---

# Loading States

Resume Upload

Extracting Resume

GitHub Import

Publishing

Exporting

Saving Portfolio

Each loading state should display progress.

---

# Success States

Resume Imported

GitHub Connected

Portfolio Saved

Portfolio Published

Export Ready

Template Applied

---

# Error States

Resume Extraction Failed

GitHub Connection Failed

Publish Failed

Export Failed

Network Error

Errors should always provide a recovery action.

---

# Responsive Behavior

Desktop

Expanded Sidebar

Tablet

Collapsed Sidebar

Mobile

Drawer Navigation

Bottom Action Bar

Preview page should support

Desktop

Tablet

Mobile simulation.

---

# Future Features

Analytics

Custom Domains

AI Portfolio Suggestions

Version History

Multiple Portfolios

Portfolio Collaboration

Theme Customizer

Portfolio Insights

Team Workspaces

---

# Design Principles

The application should feel like

- Linear
- Vercel
- Stripe
- Notion

Prioritize

- Simplicity
- Fast completion
- Minimal friction
- Professional appearance
- Clear navigation

Every screen should answer one primary question.

Avoid unnecessary forms.

Guide users step-by-step.

The primary goal is helping users publish a professional portfolio as quickly as possible.
