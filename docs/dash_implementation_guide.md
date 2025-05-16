# DASH Implementation Guide

## 👷 Developer Role Assumptions
You are a **solo developer** using:
- **Cursor** for code generation and AI integration
- **v0** for frontend UI prototyping and export
- **Next.js (App Router)** for web framework
- **PostgreSQL** for relational database
- **TailwindCSS + shadcn/ui** for design system
- **Docker** for local hosting

All modules are built using a **modular monorepo** with unified auth, shared UI, and strict folder structure.

---

## 📁 Folder Structure (Monorepo)
```
apps/
  platform/          → Core shell (auth, layout, dashboard, settings)
  forms/             → Forms module
  pir/               → Public Info Requests module

modules/             → Shared domain logic and services
  ui/                → Shared design system components
  auth/              → Login/signup, session, auth utils
  permissions/       → Role/permission utils and API
  db/                → Prisma schema and database access
  api/               → Shared API handlers/helpers

packages/
  config/            → Tailwind, eslint, tsconfig, design tokens
  lib/               → Shared helpers, hooks, utils

public/
  uploads/           → Stored files (locally)
```

---

## 🧱 Build Process

### Phase 1 – Core Platform (apps/platform)
- [ ] Set up base layout, theme toggle, routing, and auth
- [ ] Add branding admin page for logo upload + color config (locked in code)
- [ ] Create dashboard shell and user settings UI

### Phase 2 – Forms Module (apps/forms)
- [ ] Create form builder UI in **v0** (text-editor style)
- [ ] Add form field types, conditional logic, repeat sections, file uploads
- [ ] Handle metadata (IP/location capture)
- [ ] Store immutable submissions in database
- [ ] Add form versioning logic
- [ ] Implement notification rules

### Phase 3 – PIR Module (apps/pir)
- [ ] Watch for new PIR form submissions → spawn new PIR records
- [ ] Create PIR case UI: assignment, status, request tracking
- [ ] Log view of actions taken per case
- [ ] Add admin actions (reassign, close, update)

---

## 🤖 Cursor Usage Prompts

### Module Creation
```
Create a new module under `apps/pir` using the shared layout from `apps/platform`. Scaffold the routing, page.tsx, and basic UI components for list view and detail view.
```

### Backend API Logic
```
Use the shared `modules/db` and Prisma client to create a `createPIRCase()` function. It should accept form submission data and spawn a new record with default fields (status: open, createdAt, assignedTo: null).
```

### Permissions
```
Implement record-level access in the PIR module using `modules/permissions`. Only users with the `pir:reader` or `pir:admin` role can see records. Add UI guards and API guards.
```

---

## 🎨 v0 Prompt Templates

### Form Builder UI
```
Design a Tally-like form creation interface with light/dark mode. Use text-area-based input to define fields. Below the editor, render a live preview. Allow adding logic (e.g., if x then show y) using a dropdown interface.
```

### Dashboard + Widgets (Future Phase)
```
Create a dashboard grid layout with draggable widgets. Each widget displays a metric (number, chart, table). Add a modal editor to choose module, data source, and display type.
```

---

## ✅ Testing Strategy
- Write **unit tests** using Vitest or Jest for all backend logic
- Use **Playwright** or **Cypress** for integration and UI tests
- Run **visual regression tests** on component changes via Storybook (optional)

---

## 🐳 Docker Setup (Local Dev)

```Dockerfile
# Use Next.js base image
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/dash
  db:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: dash
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
```

---

## 🧠 Dev Guidelines
- Always start new features with a **Cursor prompt** and v0 UI mock
- Use modular, testable services (separate DB logic, API logic, UI)
- Write new components in `modules/ui/` and document in Storybook (if used)
- Follow atomic design for UI (base, composite, layout)
- Reuse field types, validation schemas, and types where possible
- Maintain a changelog per module

---

## 🔮 Future Features (Post-MVP)
- O365 SSO auth
- CLI tool to scaffold modules
- Public-facing project dashboards
- WebSocket-driven live data updates
- Additional modules: Project Manager, Document Center, Event Tracker