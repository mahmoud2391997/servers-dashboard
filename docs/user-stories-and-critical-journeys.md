# User Stories And Critical User Journeys

## Product Goal

Provide secure authentication and a fast monitoring view so operations users can check server health and manage sessions with minimal friction.

## Personas

- **Operations Engineer**: monitors server status and incident signals.
- **Team Lead / On-Call Owner**: needs reliable access and clear account/session controls.

## Core User Stories

1. As a user, I can log in with email/password to access protected monitoring pages.
2. As a new user, I can sign up, create an account, and land directly on the dashboard.
3. As a user, I can log in with Google/Facebook/GitHub for quicker access.
4. As an unauthenticated visitor, I am redirected from protected routes to the login page.
5. As an authenticated user, I can log out from dashboard/profile and terminate my session.
6. As an authenticated user, I can see top-level health counts (up/degraded/down/total).
7. As an authenticated user, I can search, filter, and sort server records.
8. As an authenticated user, I can verify my identity and auth provider in profile.

## Critical User Journeys

### 1) Email Login To Dashboard

**Flow**: `/login` -> submit credentials -> `/api/auth/login` sets session cookie -> auth context refreshes via `/api/auth/session` -> redirect to `/dashboard`.

**Acceptance**:
- Redirect succeeds without loading loop.
- Dashboard content renders only when session is valid.

### 2) Signup To First Dashboard Access

**Flow**: user selects Sign up -> completes form -> `/api/auth/signup` creates user + session -> context updates -> redirect to `/dashboard`.

**Acceptance**:
- Password mismatch/weak password errors are shown inline.
- Successful signup always results in authenticated dashboard access.

### 3) Social Login + Provider Validation

**Flow**: click social button (Google/Facebook/GitHub) -> provider route creates session with provider metadata -> redirect to `/dashboard` -> open `/profile`.

**Acceptance**:
- Provider shown in profile matches chosen social provider.
- Session remains valid across page navigation.

### 4) Unauthorized Access Protection

**Flow**: unauthenticated user requests `/dashboard` or `/profile` -> middleware validates session -> redirect to `/login`.

**Acceptance**:
- Protected views are never exposed without valid session.
- Redirect behavior is deterministic and non-looping.

### 5) Logout And Session Invalidation

**Flow**: click logout -> `/api/auth/logout` clears session cookie -> redirect to `/login`.

**Acceptance**:
- User cannot access protected pages again without re-authentication.

## Non-Functional Priorities

- Clear auth/loading/error feedback.
- Single auth source of truth via context hook.
- Session validation in both middleware and session API.
- Demo-friendly implementation using mock data for rapid iteration.
