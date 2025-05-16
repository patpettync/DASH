# DASH Project Roadmap

This document outlines the current state and planned development path for the DASH platform. For comprehensive product requirements, see the [Product Requirements Document](docs/dash_prd.md).

## Current State: Frontend Prototype

✅ **Implemented:**
- Next.js App Router structure
- Responsive dashboard layout
- Form builder interface
- User profile screens
- Settings management areas
- Light/dark theme support
- UI component library integration (Shadcn UI)

## Phase 1: Core Platform Completion

🔄 **In Progress:**
- Core components refinement
- Form builder functionality
- User management screens
- Role and permission UI

🔜 **Coming Soon:**
- Authentication integration
- Form submission handling
- API routes for data management
- Local data persistence
- Container and deployment configuration (see [Docker Stack](docs/docker_stack.mmd))

## Phase 2: Backend Integration

📋 **Planned:**
- PostgreSQL database setup
- Prisma ORM integration
- User authentication service
- Form submission processing
- Role-based access control
- Basic API endpoints for CRUD operations

> See the [Backend Structure](docs/backend_structure.mmd) and [Implementation Guide](docs/dash_implementation_guide.md) for more details on the planned architecture.

## Phase 3: Module Development

📋 **Planned:**
- Forms Module (complete workflow)
- PIR (Public Information Request) Module
- Notification service
- Event-driven communication between modules (see [Module Communication](docs/module_communication.mmd))
- File uploads and storage

## Phase 4: Advanced Features

📋 **Planned:**
- Analytics and reporting
- Workflow automation tools
- Integration with external services
- Mobile responsiveness improvements
- Public-facing interfaces for form submissions

## Architectural Vision

The final architecture will follow the design outlined in the [High-Level Architecture](docs/high_level_architecture.mmd) diagram, implementing a modular approach that allows for scalable development of future workflows.

---

This roadmap is tentative and may evolve based on contributors' interests and project needs. 