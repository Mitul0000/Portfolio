# Digifello AI — Frontend

React + Vite + Tailwind CSS frontend for the Digifello AI personal website.

## Setup

```bash
npm install
npm run dev
```

Make sure your backend is running at `http://localhost:3000` before starting the frontend.
The Vite dev server proxies all `/api` requests to `http://localhost:3000`.

## Pages

| Route | Description | Auth Required |
|---|---|---|
| `/` | Home / Landing | No |
| `/register` | Register new account | No |
| `/login` | Login | No |
| `/verify-otp` | Email OTP verification | No |
| `/forgot-password` | Forgot password | No |
| `/blogs` | All blogs listing | No |
| `/blogs/:blogId` | Single blog + comments | No (post comment requires auth) |
| `/tools` | Free & paid tools | No |
| `/about` | About page | No |
| `/tool-request` | Submit tool request | ✅ Yes |
| `/dashboard` | My tool requests | ✅ Yes |

## Features

- JWT auth with automatic token refresh (15 min access token, 7 day refresh)
- Axios interceptor handles 401 → refresh → retry transparently
- Token reuse detection (419) → clears storage and redirects to login
- Field-level error display from API `errors[]` array responses
- Blog HTML content rendered with `dangerouslySetInnerHTML`
- Status badges: PENDING (yellow), APPROVED (green), REJECTED (red)
- Mobile-responsive navbar with hamburger menu

## Notes

- The comment GET endpoint has a backend bug (no slash before blogId): `/comment/get${blogId}` — handled correctly
- `terms` field sent as boolean `true` (not string)
- `budget` field sent as `Number()` (not string)
- Token storage: `localStorage` → `accessToken`, `refreshToken`, `userId`
