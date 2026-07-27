# Foliora

> AI-powered portfolio builder for developers.

Foliora is a production-grade SaaS platform that enables developers to create, customize, and publish beautiful portfolio websites without writing code.

The project is being built with a strong focus on scalability, maintainability, clean architecture, and modern software engineering practices.

---

## Vision

Creating a professional portfolio should take minutes, not days.

Foliora helps developers transform their professional information into a polished portfolio through AI-assisted data import, customizable templates, and an intuitive editing experience.

---

## Planned Features

### Authentication

- Email & Password Authentication
- Google OAuth
- GitHub OAuth
- JWT Authentication
- Refresh Token Rotation

### AI Resume Import

- Upload Resume (PDF / DOCX)
- AI Resume Parsing
- Editable Imported Data

### GitHub Integration

- Connect GitHub Account
- Import Repositories
- Select Showcase Projects

### Portfolio Builder

- Multiple Portfolio Templates
- Dynamic Portfolio Sections
- Theme Support
- Portfolio Customization

### Publishing

- Public Portfolio Pages
- Custom Portfolio URL
- Custom Domains
- SSL Support

### Future Roadmap

- Portfolio Analytics
- Portfolio Code Export
- Premium Templates
- Team Features

---

## Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Hook Form
- Zod
- Axios
- Framer Motion

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Google OAuth
- GitHub OAuth

### DevOps

- Docker (Planned)
- Jenkins (Planned)
- Nginx (Planned)

---

## Repository Structure

```text
foliora/
│
├── .agents/
├── .claude/
├── assets/
├── client/
├── docs/
├── server/
│
├── CLAUDE.md
├── README.md
└── package.json
```

---

## Current Status

Project initialization has been completed.

Current progress includes:

- Project architecture
- Documentation
- Next.js frontend setup
- NestJS backend setup
- Development workflow
- Shared engineering standards

Upcoming milestone:

- Database Foundation
- Authentication
- Resume Upload
- AI Resume Parsing
- GitHub Integration
- Onboarding Flow

---

## Development Principles

Foliora follows several engineering principles:

- Feature-first architecture
- Clean Architecture
- SOLID principles
- Strict TypeScript
- Security-first development
- Accessibility-first UI
- Responsive design
- Reusable components
- Production-ready code

---

## Documentation

Project documentation is available inside the `docs/` directory.

- Architecture
- Backend
- Frontend
- Database
- API
- Security
- Product Flow
- UI Guidelines
- Design System
- Development Workflow

---

## Getting Started

### Clone

```bash
git clone <repository-url>
```

### Install

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### Run

```bash
npm run dev
```

---

## Project Status

🚧 Active Development

This project is currently under active development.

Features and APIs may change until the first public release.

---

## License

Copyright © 2026 Priya Vasudevan.

All Rights Reserved.

This repository is currently private and is not licensed for redistribution or commercial reuse.
