# Server Monitor Dashboard

A Next.js application for monitoring server status with authentication (email/password + social login simulation), protected routes, and a profile view.

## How To Run

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm (bundled with Node.js)

### Install Dependencies

```bash
npm install
```

### Run In Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build And Run Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Demo Authentication

- Email login demo credentials:
  - `admin@example.com`
  - `password123`
- Social auth buttons (Google, Facebook, GitHub) use mocked API routes in this project.

## Implementation Overview

- **Framework**: Next.js App Router with TypeScript.
- **UI**: Reusable components with Tailwind CSS styling.
- **Auth model**:
  - Session-based auth using an HTTP-only `session` cookie.
  - Session includes `userId`, `email`, `provider`, and expiry metadata.
  - Route handlers under `app/api/auth/*` manage login, signup, social login, logout, and session checks.
- **Client auth state**:
  - Global auth context via `AuthProvider` and `useAuth` hook.
  - Login/signup pages use context methods (`login`, `signup`, `socialAuth`) so session state updates before redirecting.
  - Protected pages (`/dashboard`, `/profile`) rely on auth state and middleware checks.
- **Data layer**:
  - Server data and users are mock/in-memory for demo purposes (`lib/mock-data.ts`).
  - Password hashing/verification uses `bcrypt`.

## Design Choices

- **Session cookie over local storage**:
  - Uses HTTP-only cookie to reduce client-side token exposure.
- **Compatibility in session API response**:
  - Session endpoint returns both flat and nested session shapes to avoid client mismatch during transitions.
- **Middleware + API validation**:
  - Middleware validates session cookie shape/expiry before route access.
  - Session route validates and rejects malformed or expired sessions.
- **Clear separation of concerns**:
  - API routes handle auth operations.
  - Hook/context handle client auth lifecycle.
  - Pages focus on rendering and user interactions.

## Notes

- This project currently uses mock social auth and in-memory users for development/demo.
- For production, replace mock auth/user storage with a persistent database and real OAuth flows.
