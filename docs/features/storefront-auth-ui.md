# Storefront Auth UI Implementation Plan

## Overview

The customer authentication backend and frontend pages (login, register, profile, forgot-password, reset-password) already exist and work. The missing piece is **auth awareness in the storefront navbar** — there's no way for customers to discover or access login/register from the main site navigation.

## Current State

| Component | Status |
|-----------|--------|
| Backend auth API (`/api/auth/*`) | Complete |
| AuthContext + useAuth hook | Complete |
| Login page (`/login`) | Complete (email + Google Sign-In) |
| Register page (`/register`) | Complete (with password strength) |
| Profile page (`/profile`) | Complete (edit profile + change password) |
| Forgot/Reset password | Complete |
| ProtectedRoute component | Complete |
| **Navbar auth UI** | **Missing** |

## Requirements

### Functional
- Unauthenticated users see a "Dang nhap" (Login) link/button in the navbar
- Authenticated users see their name/avatar with a dropdown menu (Profile, Logout)
- Works on both desktop and mobile navbar layouts
- Clicking "Dang nhap" navigates to `/login`
- Clicking "Dang ky" navigates to `/register`
- Clicking "Profile" navigates to `/profile`
- Logout clears tokens and refreshes the page
- Auth state persists across page navigations (already handled by AuthContext)

### Non-Functional
- Auth UI is a fixed element in the navbar, not CMS-driven (always present regardless of menu config)
- Graceful loading state — don't flash login button then switch to user name
- Matches existing site design (cream/charcoal color scheme)

## Architecture

### Key Design Decision

The navbar is CMS-driven (`settings.menuItems`), but auth UI should **always be present** regardless of CMS configuration. The auth buttons will be added as a **fixed element** after the nav links, not as a CMS block type.

### Data Flow

```
_app.js (AuthProvider wraps all pages)
  → Navbar.js imports useAuth()
  → Reads: user, isAuthenticated, isLoading, logout
  → Renders: Login button OR User dropdown
```

## Implementation Steps

### Step 1: Add auth UI to Navbar (desktop)
**File:** `frontend/components/sections/Navbar.js`

- Import `useAuth` from `@/hooks/useAuth`
- After the nav links section (right side), add an auth section:
  - **Loading**: render nothing (prevents flash)
  - **Unauthenticated**: "Dang nhap" link → `/login`
  - **Authenticated**: User avatar (first letter) + name, with dropdown on click
    - Dropdown items: "Tai khoan" → `/profile`, "Dang xuat" → calls `logout()`
- Style to match existing navbar (inline styles + settings colors)

### Step 2: Add auth UI to Navbar (mobile)
**File:** `frontend/components/sections/Navbar.js`

- In the mobile slide-down menu, append auth links after nav items:
  - **Unauthenticated**: "Dang nhap" and "Dang ky" links
  - **Authenticated**: "Tai khoan" and "Dang xuat" links

### Step 3: Fix register flow
**File:** `frontend/pages/register.js`

- Currently shows "check your email" after registration (email verification disabled)
- Already fixed in a previous session to say "Dang ky thanh cong! Ban co the dang nhap ngay"
- Verify this is still the case

### Step 4: Connect blog comments to auth
**File:** `frontend/pages/blog/[id].js`

- Already uses `useAuth` and `isAuthenticated`
- When user is logged in, comments show their real name
- No changes needed — just verify integration works end-to-end

## API Changes

None — all backend endpoints already exist:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `PUT /api/auth/me`
- `PUT /api/auth/change-password`

## Database Changes

None — Customer model already exists.

## Testing Strategy

### Manual Testing
1. **Navbar (unauthenticated)**: Visit storefront → verify "Dang nhap" link visible in navbar
2. **Register**: Click register → fill form → verify success → login
3. **Login**: Click login → enter credentials → verify redirected and navbar shows user name
4. **Profile**: Click user dropdown → "Tai khoan" → verify profile page loads
5. **Logout**: Click user dropdown → "Dang xuat" → verify redirected and navbar shows login button again
6. **Protected route**: Visit `/profile` while logged out → verify redirect to `/login?redirect=/profile` → login → verify redirect back to `/profile`
7. **Mobile**: Test all above on mobile viewport
8. **Blog integration**: Login → go to blog post → submit comment → verify name shows (not "An danh")

## Rollout Plan

1. Modify Navbar.js (Steps 1-2) — single commit
2. Verify register flow (Step 3)
3. Test end-to-end, then merge to main

## Dependencies Between Steps

```
Step 1 (Desktop navbar) → Step 2 (Mobile navbar) → Step 3 (Register check)
```

All steps modify existing files — no new files needed.

---
*Generated: 2026-03-29*
