# UI Guidelines

## Purpose

This document defines the visual design system, UI standards, and user experience principles for Foliora.

Its purpose is to ensure every page, component, interaction, and layout follows a consistent design language.

This document explains **how Foliora should look and feel**, not how to implement UI components.

---

# Design Philosophy

Foliora should feel:

- Modern
- Professional
- Clean
- Minimal
- Fast
- Trustworthy

The design should prioritize clarity over decoration.

Every interface should help users accomplish tasks with minimal cognitive effort.

Design inspiration includes:

- Linear
- Stripe
- Vercel
- Notion
- GitHub

Avoid unnecessary visual complexity.

---

# Design Principles

Every UI should follow these principles:

- Consistency
- Simplicity
- Clear hierarchy
- Accessibility
- Responsiveness
- Reusability

Interfaces should feel predictable.

Users should never need to guess how something works.

---

# Color System

Foliora uses a centralized design token system defined in the Tailwind configuration.

All components should use these semantic color names instead of hardcoded color values.

```ts
colors: {
  primary: "#4F46E5",

  success: "#10B981",

  warning: "#F59E0B",

  danger: "#EF4444",

  background: "#F8FAFC",

  surface: "#FFFFFF",

  surfaceAlt: "#EEF2FF",

  text: "#0F172A",

  textMuted: "#64748B",

  border: "#E2E8F0",
}
```

Use the corresponding Tailwind utility classes throughout the project.

| Purpose           | Tailwind Class                                 |
| ----------------- | ---------------------------------------------- |
| Primary           | `bg-primary`, `text-primary`, `border-primary` |
| Success           | `bg-success`, `text-success`                   |
| Warning           | `bg-warning`, `text-warning`                   |
| Danger            | `bg-danger`, `text-danger`                     |
| Background        | `bg-background`                                |
| Surface           | `bg-surface`                                   |
| Alternate Surface | `bg-surfaceAlt`                                |
| Primary Text      | `text-text`                                    |
| Secondary Text    | `text-textMuted`                               |
| Borders           | `border-border`                                |

Do not use hardcoded color values inside components.

Always use the semantic Tailwind utility classes.

---

# Typography

Foliora uses **Geist** as the application's primary typeface.

Typography should remain clean, modern, and highly readable.

The typography hierarchy is:

| Element   | Purpose                |
| --------- | ---------------------- |
| Heading 1 | Major page titles      |
| Heading 2 | Section headings       |
| Heading 3 | Subsections            |
| Body      | Default content        |
| Caption   | Supporting information |

General guidelines:

- Maintain clear visual hierarchy.
- Use consistent font weights.
- Keep line lengths comfortable for reading.
- Use consistent spacing between headings and content.
- Avoid excessive font sizes or weights.

Typography should prioritize readability over decoration.

---

# Spacing

Use a consistent spacing scale.

Preferred spacing:

```
4
8
12
16
24
32
48
64
```

Avoid arbitrary spacing values.

---

# Layout Principles

Pages should use:

- Clear hierarchy
- Consistent spacing
- Generous whitespace
- Predictable alignment

Maximum content width should remain consistent across the application.

---

# Navigation

Navigation should be:

- Simple
- Consistent
- Easy to scan

Current page should always be visually identifiable.

---

# Buttons

Primary Button

Used for the main action on a page.

Example:

Save

Publish

Continue

---

Secondary Button

Used for supporting actions.

---

Danger Button

Used for destructive actions.

Examples:

Delete

Remove

Cancel Subscription

---

Avoid placing multiple primary buttons close together.

---

# Forms

Forms should:

- Have clear labels
- Show validation immediately
- Clearly identify required fields
- Display helpful error messages

Related fields should be grouped together.

Long forms should be divided into logical sections.

---

# Input Fields

Every input should have:

- Label
- Placeholder when helpful
- Validation message
- Disabled state
- Focus state

Avoid placeholder-only inputs.

---

# Cards

Cards should be used to group related information.

Cards should maintain:

- Consistent padding
- Rounded corners
- Subtle borders
- Minimal shadows

Avoid excessive visual effects.

---

# Icons

Foliora should maintain a consistent icon style throughout the application.

Lucide React is the preferred icon library for all general UI elements.

Examples:

- Navigation
- Dashboard
- Forms
- Buttons
- Tables
- Settings

React Icons may be used when an official brand logo is required or when Lucide does not provide an appropriate icon.

Examples:

- GitHub
- Google
- LinkedIn
- X (Twitter)

Avoid mixing multiple icon styles within the same view unless there is a clear reason.

---

# Empty States

Every empty state should explain:

- Why nothing is displayed
- What the user can do next

Examples:

No portfolios yet.

Create your first portfolio to get started.

---

# Loading States

Every asynchronous action should display feedback.

Examples:

- Skeleton loaders
- Loading buttons
- Progress indicators

Avoid blank pages during loading.

---

# Error States

Error messages should:

- Clearly explain the problem
- Suggest the next action
- Avoid technical language

Good:

```
Unable to load your portfolios.

Please try again.
```

Avoid:

```
500 Internal Server Error
```

---

# Success Feedback

Successful actions should provide immediate feedback.

Examples:

- Toast notifications
- Success banners
- Loading button completion

Users should never wonder whether an action succeeded.

---

# Modals

Use modals only for:

- Confirmation
- Small forms
- Important decisions

Avoid placing large workflows inside modals.

---

# Tables

Tables should support:

- Sorting
- Responsive layout
- Empty state
- Loading state

Avoid horizontal scrolling where possible.

---

# Responsive Design

Design mobile-first.

Support:

- Mobile
- Tablet
- Laptop
- Desktop

Layouts should adapt gracefully to different screen sizes.

---

# Accessibility

Every interface should support:

- Keyboard navigation
- Visible focus indicators
- Semantic HTML
- Proper labels
- ARIA attributes where appropriate
- Sufficient color contrast

Accessibility is a requirement, not an enhancement.

---

# Animations

Animations should:

- Feel smooth
- Be subtle
- Improve understanding

Avoid unnecessary motion.

Use animation to:

- Show transitions
- Confirm actions
- Improve perceived performance

---

# Reusability

Before creating a new component, determine whether an existing component can be reused.

Maintain consistency across the application.

Avoid duplicate UI components.

---

# Anti-Patterns

Avoid:

- Inconsistent spacing
- Multiple button styles
- Excessive colors
- Large blocks of text
- Decorative animations
- Inconsistent typography
- Mixing icon libraries
- Desktop-only layouts

---

# Summary

Foliora's interface should feel modern, clean, and professional.

Every page should follow the same visual language to create a cohesive experience.

When in doubt:

- Keep it simple.
- Prioritize usability.
- Maintain consistency.
- Reuse components.
- Design for accessibility first.
