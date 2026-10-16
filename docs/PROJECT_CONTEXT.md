# Little Giant Labs Project Context

Verified from the repository source and migration on 2026-10-16. Live Vercel, Firebase, and Supabase configuration was not queried. When source and this document differ, source is authoritative until the intended policy is reconciled.

## 1. Project Overview

Little Giant Labs is a company website built with Next.js. Public routes include the home, work, about, contact, and application-received pages. The contact page contains an application form; submissions are validated in a server route and stored in Supabase. An administrator login and protected, read-only Phase 1 dashboard are implemented.

## 2. Technology Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4.
- Vercel is the documented deployment target (`README.md`); `.vercel` is ignored. No `vercel.json` or deployment linkage was found, so an active Vercel deployment is unverified.
- Supabase PostgreSQL, accessed with `@supabase/supabase-js` through a server-only service-role client.
- Firebase Web SDK for administrator sign-in and verification; Firebase Admin SDK for server-side token/session verification and revocation.
- Framer Motion, GSAP, and Lenis are present as website libraries. `@vercel/blob` is installed and public media URLs appear in source; usage/configuration is outside the submission flow.

## 3. Architecture and Data Flow

### Public website and submissions

- App Router pages are under `app/`; shared UI is under `components/`.
- The application form posts JSON to `POST /api/applications` (`app/api/applications/route.ts`). `lib/application-submission.ts` enforces JSON content type, a 16 KiB body limit, same-origin check when an Origin header is supplied, validation, safe error responses, and redacted diagnostic logging.
- `lib/application-validation.ts` validates required fields and enum answers, normalizes legal name/email/LinkedIn, calculates qualification and rejection reasons on the server. Client-supplied qualification fields do not control the saved values.
- The route inserts the validated record into `public.growth_applications` using `lib/supabase/server.ts`. The service-role key is server-only and bypasses RLS.

### Administrator authentication

- `/admin/login` uses `components/admin/AdminLoginForm.tsx` and Firebase email/password sign-in. Unverified users can request verification; `/admin/verify-email` applies the action code and returns them to login.
- The client sends its Firebase ID token to `POST /api/admin/session`. The server checks request origin, bounds/parses the request, verifies token and revocation status, authorizes claims, then issues a five-day HTTP-only, `SameSite=Strict` cookie, Secure in production.
- `lib/admin-session.ts` verifies that cookie with revocation checking. `/admin` redirects to login without a valid authorized session. `POST /api/admin/logout` checks origin, revokes refresh tokens when possible, and clears the cookie.
- There is no middleware-based admin gate. `/admin` and `/admin/dashboard` verify the session server-side; `/api/admin/applications` verifies it on every request before using the server-only Supabase client. The API selects only fields needed by the dashboard, validates page and pageSize, and returns 25 records by default in deterministic newest-first order.

## 4. Database and Application Data

The authoritative checked-in schema is `supabase/migrations/202610150001_create_growth_applications.sql`. It creates `public.growth_applications` with:

| Column | Type / behavior |
| --- | --- |
| `id` | `uuid` primary key, default `gen_random_uuid()` |
| `legal_name` | required `text` |
| `industry_vertical` | required `text`, constrained to five application options |
| `ttm_revenue` | required `text`, constrained to four options |
| `monthly_ad_spend` | required `text`, constrained to four options |
| `growth_bottleneck` | required `text`, constrained to four options |
| `partnership_readiness` | required `text`, constrained to two options |
| `decision_maker_email` | required `text` |
| `decision_maker_linkedin` | required `text` |
| `qualification_status` | required `text`, default `qualified`, constrained to `qualified` / `rejected` |
| `rejection_reasons` | nullable `jsonb`; validator supplies an array of reason-code strings |
| `submitted_at` | required `timestamptz`, default `now()` |

The seven application answers are industry, annual revenue, monthly ad spend, growth bottleneck, partnership readiness, decision-maker email, and LinkedIn profile. Legal name is a separate required field. Qualification rejects applications selecting under $1M revenue, under $10K monthly ad spend, and/or the cheap execution vendor option. Reasons are `ttm_revenue_below_1m`, `monthly_ad_spend_below_10k`, and `cheap_execution_vendor`; rejected submissions are still stored.

The migration enables RLS, creates no public/anon/authenticated policies, revokes table access from `PUBLIC`, `anon`, and `authenticated`, grants access to `service_role`, and includes assertions for those controls. This describes the migration only: application of the migration and live database grants/policies must be verified against the target Supabase project. The README contains SQL verification queries.

## 5. Authentication and Security Decisions

### Intended policy

Administrator accounts are created manually in Firebase Console → Authentication → Add user. Firebase is used exclusively for administrators. Under the current intended policy, any verified Firebase account is an administrator. There is no public registration, `ADMIN_EMAILS` allowlist, or custom-claims requirement. Server-side authentication, session protection, and CSRF/origin protections must remain in place.

### Actual implementation discrepancy

Current code requires both `email_verified === true` and a normalized email present in server-side `ADMIN_EMAILS` at session creation and on every protected session read (`lib/admin-email-allowlist.ts`, `app/api/admin/session/route.ts`, `lib/admin-session.ts`). Missing/empty allowlist denies access. This differs from the intended verified-account policy. The login UI permits sign-in and verification but does not itself provision users. Do not treat intended policy as implemented; reconcile in a separately scoped implementation task.

### Existing protections and environment variables

- Admin session creation/logout require matching Origin; cookie is HTTP-only, Strict SameSite, production Secure, five-day lifetime. Session verification checks revocation. Login token body is size-limited. Application submission validates input and body size and redacts submitted data in diagnostic errors.
- Supabase RLS/grant protections are defined by the migration. The service-role API path intentionally bypasses RLS. The public submission handler has no rate limit or CAPTCHA in inspected code (also noted in `docs/codebase-investigation/security/firebase-admin-auth-audit.md`).
- `SUPABASE_URL`: server Supabase project URL. `SUPABASE_SERVICE_ROLE_KEY`: server-only privileged key for inserts.
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase Web SDK configuration exposed to the browser.
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`: server-side Firebase Admin service-account configuration; private key must remain secret.
- `ADMIN_EMAILS`: current server-side comma-separated authorization allowlist, despite not being part of intended policy.

Names and purposes above are verified in `.env.example`, README, and source; no secret values or `.env` contents are documented. Actual environment values, scopes, account state, deployed settings, and whether the migration ran are unverified. `.env.example` contains placeholder allowlist values; these are not proof of production configuration.

## 6. Current Implementation Status

Confirmed in source:

- Public website routes and application submission/validation/qualification path exist.
- Supabase table migration and restrictive RLS/grant setup exist in the repository.
- Firebase login, email verification, server token verification, session cookie, protected admin page, and logout exist.
- `/admin` redirects authorized sessions to `/admin/dashboard`. The dashboard displays three summary metrics, an all-time qualified/rejected breakdown, and a read-only paginated applications table.
- Dashboard metrics use exact database counts and persisted statuses. The rolling seven-day window is calculated from server UTC time. API responses are no-store and use safe error messages.
- Tests covering application validation, admin-auth behavior, and dashboard route/API contracts pass. `npx tsc --noEmit` and ESLint for changed files pass. The repository-wide lint still reports existing errors in `HomeSections.tsx`, `Footer.tsx`, `Header.tsx`, and `CaseStudyGrid.tsx`. Production build compilation was blocked when Next.js could not fetch the existing Google Fonts; build completion is unverified.

Not verified from repository alone: live Supabase schema/security state, deployed Vercel configuration or deployment, Firebase Console settings/admin accounts, and production end-to-end behavior.

Git state at inspection: pre-existing modification to `.gitignore`; it was not changed for this task. Latest commit shown was `d19e586`.

## 7. Development Roadmap

Planning only; no phase is marked complete based on plans.

- **Phase 1:** Connect the existing admin dashboard to Supabase, implement the protected applications API, show total and rolling seven-day volume metrics with an all-time qualification breakdown, and build a paginated, newest-first applications table. **Status: implemented in repository; production database and deployment behavior not verified.**
- **Phase 2:** Add application details and server-side filters. **Status: not implemented.**
- **Phase 3:** Add secure CSV export for records matching active filters. **Status: not implemented.**
- **Phase 4:** Complete security hardening, tests, deployment verification, and production checks. **Status: pending.**

## 8. Known Issues and Unresolved Questions

- Authorization policy discrepancy: intended verified-Firebase-account access versus implemented `ADMIN_EMAILS` allowlist.
- Whether the checked-in migration is applied and actual live RLS policies/table grants are as expected is unknown.
- Dashboard schema and access behavior are based on the checked-in migration; live Supabase grants, RLS state, and data were not queried.
- Vercel deployment existence, environment variable values/scopes, and production behavior are not verified.
- Firebase sign-in settings, verified admin accounts, service-account permissions, and project alignment are not verified.
- Public submission abuse controls such as rate limiting/CAPTCHA were not found in the inspected handler; decide whether and how to address in a security-hardening task.

## 9. Maintenance Instructions

Update this document when architecture, security decisions, implementation status, or the next milestone materially changes. Verify claims against source/configuration first; label live/external facts as unverified unless checked. Keep stable decisions, concise status, and next milestones. Do not paste source files, full prompts, long logs, secret values, or exhaustive file listings here. Keep coding instructions in the root `AGENTS.md`; read this detailed context only when relevant to the task.
