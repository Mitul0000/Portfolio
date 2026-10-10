# Frontend Codebase Audit (Phase 0)

## 1. What Exists & Current State
The project `Portfolio-frontend` has a baseline React 18 + Vite + Tailwind setup with:
- `src/App.jsx`: Basic routing setup.
- `src/utils/axios.js`: Axios instance with partial token refresh mechanism.
- `src/utils/AuthContext.jsx`: Rudimentary Auth context storing only `userId` and token in state.
- `src/components/Navbar.jsx`, `Footer.jsx`, `ProtectedRoute.jsx`: Existing shell and navigation components.
- Existing pages: `Home.jsx`, `Blogs.jsx`, `BlogDetail.jsx`, `Tools.jsx`, `About.jsx`, `Login.jsx`, `Register.jsx`, `VerifyOtp.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, `ToolRequest.jsx`, `Dashboard.jsx`.

## 2. Issues & Deficiencies Identified

### Hardcoded URLs and Environment
- `src/utils/axios.js` hardcodes `baseURL: "http://localhost:3000/api"` and `http://localhost:3000/api/auth/refresh`.
- Missing `.env.example` and missing reliance on `import.meta.env.VITE_API_URL`.

### Critical API Endpoint Bugs
- In `src/pages/BlogDetail.jsx` line 151 and 187: Calling `/comment/get${blogId}` without a slash (should be `/comment/get/${blogId}`).
- In `src/pages/Dashboard.jsx`: Request to `GET /request/get-requests` passes body `{ data: { user: { _id: user.userId } } }`. The backend uses `request.user._id` from the JWT token and ignores request body in GET.
- In `src/pages/BlogDetail.jsx`: Comment submission passed `{ user: { _id: user.userId }, blogId, content }`. Backend extracts `userId` from `request.user._id` in `isAuth` middleware; body `user` is ignored.

### Missing Pages & Features required by Plan
- Missing pages:
  - `/services` (Services static page)
  - `/consultancy` (Consultancy static page)
  - `/privacy` (Privacy static page linked by footer and email templates)
  - `/support` (Support static page linked by footer and email templates)
- Navbar lacks links to Services, Consultancy, theme switcher, and client-side instant search modal.
- `AuthContext` does not store email (necessary for pre-filling tool requests and session display).
- Session handling lacks 419 token reuse error user notification.

### Design Language Deficiencies (AI Aesthetics vs Reference Design)
- The existing pages use generic vibrant neon purple/indigo gradients, floating cursor glow trails, click particles, and saturated glassmorphism that look stereotypically AI-generated.
- The reference design (`kentcdodds.com/blog`) calls for:
  - Deep dark charcoal-blue background (`#1f2028`), clean text-first layout, generous whitespace.
  - Two-tone headlines (white sentence + muted grey sentence).
  - Pill-shaped search fields with result count on the right.
  - Round 44px outline icon buttons, circular avatar with ring.
  - Clean typography using `@fontsource/geist-sans`.
  - Light/dark theme support with CSS variables.
  - Clean custom `HeroArt` geometric SVG instead of generic stock visuals.

## 3. Reuse Plan
- Reuse core dependencies: `react`, `react-router-dom`, `axios`, `tailwindcss`.
- Refactor `src/utils/axios.js` to strictly follow Section 3 session specifications and use `VITE_API_URL`.
- Refactor `src/utils/AuthContext.jsx` to manage tokens, userId, email, and proper logout.
- Rewrite all pages and components with the new design tokens, clean modular components, and error/loading/empty states.
