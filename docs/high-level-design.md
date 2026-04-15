# High-Level Design Document

## 1) Scope

The system provides:
- authentication (email/password + mocked social login),
- protected dashboard/profile routes,
- server status monitoring with search/filter/sort,
- session and account management.

## 2) Architecture Summary

### Frontend (Next.js App Router)

- Pages: `/login`, `/signup`, `/dashboard`, `/profile`.
- Shared UI components in `components/`.
- Global auth state via `AuthProvider` + `useAuth`.

### Backend (Route Handlers)

Auth APIs in `app/api/auth/*`:
- `login`, `signup`, `google`, `facebook`, `github`, `session`, `logout`.
- APIs create/check/delete HTTP-only session cookie and return session metadata.

### Middleware

`middleware.ts` handles access control:
- unauthenticated -> redirect protected routes to `/login`,
- authenticated -> redirect `/login` and `/signup` to `/dashboard`,
- `/` redirects by session state.

## 3) Auth And Session Design

- Session cookie key: `session` (HTTP-only, expiring).
- Payload: `userId`, `email`, `provider`, optional display fields, `expiresAt`.
- Validation performed in both middleware and session API.
- Cookie parsing supports raw and URL-encoded JSON for robustness.
- Login/signup/social pages use context methods to synchronize auth state before redirect.

## 4) Data Design

- **Servers**: in-memory mock dataset (`lib/mock-data.ts`) with status, latency, uptime, and region.
- **Users**: in-memory records for demo scope.
- **Passwords**: hashed/verified with `bcrypt`.

## 5) Security And Reliability Choices

- HTTP-only cookie instead of local storage tokens.
- Route-level auth gating plus API-level session validation.
- Safe default behavior: invalid/expired sessions are treated as unauthenticated.
- Provider metadata is stored in session to support accurate profile display.

## 6) Current Limitations

- No persistent database yet.
- Social login is mocked (no real OAuth exchange).
- No RBAC/multi-role permissions.

## 7) Extension Plan

1. Replace mock users with persistent database.
2. Integrate real OAuth providers.
3. Add live status updates (polling/WebSocket).
4. Add automated tests for auth journeys and middleware redirects.
