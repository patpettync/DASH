# DASH Platform — Product Requirements Document (PRD)

## 1. Overview
**Product Name**: DASH (Digital Administrative Services Hub)  
**Primary Stakeholder**: Internal municipal staff (admin + departmental users)  
**Goal**: Replace Smartsheet-based workflows with a modular, internally-hosted application platform that allows scalable development of future workflows using a shared codebase and design system.

---

## 2. Core Objectives
- Unify all internal data workflows within a centralized web platform.
- Enable easy development of new mini-applications (modules) for specific workflows.
- Empower non-technical staff to interact with data/forms without dev knowledge.
- Maintain full administrative control over branding, access, and deployments.

---

## 3. Users & Roles

### User Types
- **Admin Users**: Full access to create, edit, assign roles, manage modules.
- **Staff Users**: Role-based access to specific modules, form submissions, dashboards.
- **Department-Level Roles**: Restrict access to forms or submissions related to specific teams.

### Permissions
- Centralized role builder UI
- Support for multiple roles per user
- Granular permissions per module, and optionally per record

---

## 4. MVP Modules

### A. Core Platform
- Central layout shell
- Authentication (email/password)
- Admin-configured branding (logo upload, org-wide color theming)
- Navigation UI for accessing modules

### B. Forms Module
- Tally-style form builder (text-based form creation)
- Conditional logic, field validation, file uploads, signature capture, captcha
- Form version control
- Public preview/embed links
- Form submission metadata (IP, location)
- Admin-defined notification routing per form

### C. PIR Module (Public Information Requests)
- Triggered from forms
- Auto-generates PIR record with additional workflow fields
- Trackable internal requests per PIR case
- Request assignment to internal users
- Internal step-based progress tracking with logs
- Status updates and internal comms

---

## 5. Dashboard & Widget System
- Personalized dashboard per user
- Widgets display data from APIs (e.g., counts, tables, graphs)
- Drag-to-resize widgets (larger = more data or charts)
- Filter options in widget config UI only (not on dashboard view)
- Shared dashboards are read-only with clone option

---

## 6. Forms-to-Module Workflow
- Each form submission becomes a record (row) with additional fields added by the receiving module
- Submission triggers: notify users, auto-assign cases, transition status
- All module workflows are hardcoded, no visual workflow builder is needed

---

## 7. Architecture Requirements
- Monorepo codebase (Next.js + PostgreSQL + Docker)
- All modules live under shared `apps/` and `modules/`
- Modules must be logically isolated (hot-swappable, failure-resistant)
- All access is gated by authentication (no public dashboards)
- Future portals may be built per module with public access + auth

---

## 8. Design System
- Uses TailwindCSS + shadcn/ui
- All UI components shared via centralized library
- New components added to design system before use
- Admin-defined organization-wide branding (locked in code)
- Supports light/dark mode

---

## 9. Data & Records
- Relational PostgreSQL schema
- Numeric record IDs
- Audit logs per record, per module
- Files stored locally
- Form submissions are immutable legal records (no edits allowed)

---

## 10. Authentication & User Management
- Email/password login MVP
- Future SSO integration (O365)
- All users managed globally (not per-module)

---

## 11. Testing & Quality
- Unit tests
- Integration tests
- Visual regression testing
- Modules must be AI/LLM prompt-safe for Cursor use

---

## 12. Non-MVP Features (Future Phases)
- SSO integration
- Public-facing dashboards from project modules
- Module CLI or dynamic scaffold tool
- Real-time data updates via WebSockets or polling
- Form workflow visual preview
