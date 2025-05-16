# DASH - Digital Administrative Services Hub

## 👋 Project Overview

DASH is a modern, modular administrative platform designed to replace Smartsheet-based workflows with a scalable, internally-hosted application. Built with React, Next.js, and Shadcn UI, DASH aims to provide municipal staff with a cohesive system for managing forms, requests, and administrative processes.

![Dashboard Preview](public/placeholder.jpg)

## ✨ Current State

This repository contains the **frontend prototype** of DASH, featuring:

- Modern UI built with Next.js App Router, React, and Shadcn UI components
- Responsive dashboard layouts
- Form builder interface
- User management screens
- Role/permission management
- Theme customization with dark/light modes

## 🚀 Future Vision

The complete DASH platform will evolve into a modular monorepo with:
- Backend services built with Node.js
- PostgreSQL database integration
- Authentication and permission systems
- Form submission and workflow processing
- Public information request (PIR) tracking
- Event-driven architecture for module communication

## 📚 Documentation

Find comprehensive documentation in the `docs/` folder:

- [Product Requirements Document](docs/dash_prd.md) - Core product goals and specifications
- [Implementation Guide](docs/dash_implementation_guide.md) - Development patterns and workflow
- Architecture diagrams:
  - [High-Level Architecture](docs/high_level_architecture.mmd)
  - [Frontend Structure](docs/frontend_structure.mmd)
  - [Backend Structure](docs/backend_structure.mmd)
  - [Module Communication](docs/module_communication.mmd)
  - [Docker Stack](docs/docker_stack.mmd)

See the [ROADMAP.md](ROADMAP.md) for the current project status and upcoming plans.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
- **Planned Backend**: Node.js, PostgreSQL, Redis
- **Tools**: Cursor AI for development, v0 for UI prototyping

## 🏁 Getting Started

```bash
# Install dependencies
npm install
# or
pnpm install

# Run the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🤝 Contributing

This project is in active development and looking for contributors! Whether you're interested in frontend development, backend architecture, or documentation, your help is welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get involved.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔍 Project Status

This is a work in progress. The current focus is on refining the frontend components and preparing for backend integration. 