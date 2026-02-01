# Startupshala

Lightweight marketplace for deals — backend (API) + frontend (Next.js).

## Overview

- **Backend**: Node.js API located in `backend/` (Express-based, controllers, models, routes).
- **Frontend**: Next.js app located in `frontend/` (App Router, React + Tailwind UI components).

## Tech stack

- Node.js, Express
- Next.js (App Router)
- Tailwind CSS
- MongoDB (or another DB configured in `backend`)

## Repo layout

- `backend/` — API server (see `backend/src/` for controllers, models, routes).
- `frontend/` — Next.js app (app directory, components, lib, hooks).

## Setup (local)

Prerequisites: `node` (18+ recommended), `npm` or `pnpm`, and a running database if required.

1. Backend

   - Open a terminal and run:

   ```bash
   cd backend
   npm install
   # start the server (check package.json for exact scripts)
   npm run dev
   ```

   - Configure environment variables for the backend in `backend/.env` (create as needed).

2. Frontend

   - In a separate terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   - Frontend environment variables live in `frontend/.env.local` (see [frontend/.env.local](frontend/.env.local)).

## Environment

- Backend: create `backend/.env` with keys such as `PORT`, `MONGO_URI`, `JWT_SECRET` (verify exact names in `backend/src`).
- Frontend: set any API base URL or public keys in `frontend/.env.local`.

## Common tasks

- Install dependencies: `npm install` (in both `backend/` and `frontend/`).
- Run development servers: `npm run dev`.
- Build frontend for production: `cd frontend && npm run build`.

## Deployment

- Backend: follow your host (Vercel, Render, Heroku) Node.js deployment docs. `backend/vercel.json` may include Vercel config.
- Frontend: Next.js can be deployed to Vercel or other hosts — check `frontend/next.config.js` for custom settings.

## Contributing

- Fork, branch, and open a PR. Keep changes focused and add tests where appropriate.

## Where to look next

- Backend entry: `backend/src/server.js`.
- Frontend entry: `frontend/app/page.tsx` and `frontend/components`.

---

If you want, I can:

- add example `.env` templates for backend/frontend,

# Startupshala

Welcome — Startupshala is a small, opinionated marketplace for limited-time deals. This repo contains a Node/Express backend that exposes a simple API and a Next.js frontend (App Router) that consumes it. The goal of this README is to explain how the whole system works end-to-end, how authentication and claiming flows work, and what we'd improve to make this production-ready.

## Quick snapshot

- Backend: `backend/` — Express API with controllers, models, and route files.
- Frontend: `frontend/` — Next.js (App Router) using React + Tailwind-based UI components.
- Data: MongoDB (or another document DB) is expected; connection settings live in backend environment variables.

- Live demo: https://startupshalafrontend.vercel.app/ (deployed)

## End-to-end application flow (user story)

1. A new user signs up on the frontend (`/register`) and receives an auth token after successful signup.
2. The user signs in (`/login`), frontend stores a short-lived `accessToken` (HTTP-only cookie or memory) and optionally a refresh token.
3. The user visits the deals list (`/deals`). The frontend requests a list of active deals from the backend API and renders cards using components in `frontend/components`.
4. When the user clicks "Claim" on a deal, the frontend calls the backend `/claims` endpoint with the deal id and the user's auth token.
5. The backend validates the token, checks deal availability and user's eligibility, creates a `claim` record, decrements the deal's available quantity, and returns the claim status.
6. The frontend shows instant feedback (success or error) and updates the UI accordingly.

This simple flow keeps the UX snappy while the backend enforces correctness and concurrency rules.

## Authentication and authorization strategy

- Authentication: JSON Web Tokens (JWT) issued by the backend on successful login/signup. Tokens are short-lived access tokens; a refresh token strategy is recommended for production.
- Storage: Prefer HTTP-only secure cookies for access tokens to reduce XSS risk. If using localStorage, accept the added XSS risk and harden frontend input sanitization.
- Authorization: Role-based checks are lightweight — most routes verify the user's ID from the token. Sensitive operations (e.g., adjusting deal inventory) are limited to admin roles.
- Token verification: Backend uses middleware (`backend/src/middleware/authMiddleware.js`) to verify JWT, attach `req.user`, and enforce roles where needed.

Security notes:
- Use TLS (HTTPS) in production.
- Rotate `JWT_SECRET` and use reasonably short token TTL (e.g., 15 minutes access, 7 days refresh).

## Internal flow of claiming a deal (detailed)

1. Frontend POST `/api/claims` with `{ dealId }` and Authorization header.
2. Backend middleware validates JWT and extracts `userId`.
3. Backend fetches the deal row/document and checks:
    - `availableQuantity > 0`
    - user-specific rules (e.g., one-claim-per-user)
4. Backend begins a transactional operation (or uses an atomic DB operation):
    - create `Claim` document with status `pending`/`confirmed`.
    - decrement `Deal.availableQuantity` atomically (e.g., MongoDB `findOneAndUpdate` with `$inc: { availableQuantity: -1 }` and conditional `availableQuantity > 0`).
5. If the update succeeds, confirm the claim (set `confirmed`, return success). If it fails (no quantity), return a friendly error.
6. Backend returns structured JSON `{ success: boolean, claimId?, message? }`.

Implementation tips:
- Use DB-level atomic operations to prevent race conditions. If the DB doesn't support multi-document transactions easily, store counters and use conditional updates.
- Return specific error codes for UX clarity (e.g., `409` for "sold out").

## Interaction between frontend and backend

- API surface: RESTful JSON endpoints under `backend/src/routes` (e.g., `/api/auth`, `/api/deals`, `/api/claims`). Check `backend/src/server.js` for mount points.
- Communication patterns:
   - Frontend fetches lists (`GET /deals`) and detail (`GET /deals/:id`).
   - Claim operation via `POST /claims` with authentication header.
   - Frontend expects clear success/error JSON and updates UI based on status codes.
- Error handling: Backend returns meaningful messages and status codes. The frontend should show non-technical, human-friendly messages.

Practical notes:
- Keep API base URL configurable via `frontend/.env.local`.
- Prefer small, focused endpoints over large catch-all routes.

## Known limitations or weak points

- Concurrency risks: naive decrement of inventory in application code can be racy; must use atomic DB updates or transactions.
- Authentication storage: if tokens are stored insecurely in the frontend, XSS can lead to token theft.
- No rate limiting: the API currently lacks request throttling which could allow abuse.
- No strong input validation everywhere — some endpoints may accept malformed input.
- Limited observability: missing structured logs, metrics, and distributed tracing.

## Improvements required for production readiness

- Security
   - Serve all traffic over HTTPS.
   - Use HTTP-only secure cookies for JWTs or implement rotating refresh tokens.
   - Add input validation and sanitization on all endpoints (e.g., using `joi` or `zod`).
   - Implement rate limiting (e.g., `express-rate-limit`) and IP-based protections.

- Data & correctness
   - Use database transactions or strong conditional updates when modifying inventory.
   - Add idempotency keys for critical operations if clients may retry requests.

- Reliability & ops
   - Add structured logging (JSON), metrics (Prometheus), and error reporting (Sentry).
   - Add health checks, readiness checks, and graceful shutdown logic.
   - Add backups and DB monitoring.

- Testing & automation
   - Add unit tests for critical logic (claiming, auth middleware).
   - Add integration tests for full claim flow (frontend ↔ backend in CI).
   - Add end-to-end tests covering signup/login/claim flows.

- CI/CD
   - Automate linting, tests, and builds on PRs.
   - Provide a deployment pipeline with environment configuration separated from code.

## UI and performance considerations

- UX
   - Show optimistic UI for claims but reconcile with server response (show "processing" then confirm).
   - Present clear states: available, low-stock, sold-out, claimed-by-you.
   - Provide accessible UI (ARIA attributes, keyboard navigation).

- Performance
   - Cache static lists where appropriate (short TTL) to reduce backend load.
   - Use pagination or infinite scroll for large deal lists.
   - Move heavy calculations to the backend; keep frontend rendering light.
   - Use image optimization (Next.js Image) and lazy-loading for deal thumbnails.

## Running locally (short)

1. Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` with at least:

- `PORT` — port to run the API
- `MONGO_URI` — connection string
- `JWT_SECRET` — signing key for tokens

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local` with keys like `NEXT_PUBLIC_API_BASE_URL`.

## Where to look in the code

- API server entry: `backend/src/server.js`.
- Auth middleware: `backend/src/middleware/authMiddleware.js`.
- Claim model: `backend/src/models/claimmodel.js`.
- Deal model: `backend/src/models/dealmodel.js`.
- Frontend pages: `frontend/app/` and components under `frontend/components`.

## Next steps I can help with

- Add example `.env` templates for backend and frontend.
- Create a basic API reference (endpoints and payloads).
- Add a checklist and scripts for CI/CD, health checks, and monitoring.

If you'd like, I can add any of the above now — tell me which item to prioritize.
