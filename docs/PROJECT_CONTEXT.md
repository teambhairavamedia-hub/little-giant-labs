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
- `lib/application-validation.ts` validates required fields and enum answers, normalizes legal name/email/LinkedIn, and assigns new submissions the neutral `pending_review` status. Qualification decisions are left to administrators.
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
| `qualification_status` | required `text`, default `pending_review`, constrained to `qualified` / `rejected` / `pending_review` |
| `rejection_reasons` | nullable `jsonb`; retained to display historical stored reason codes |
| `submitted_at` | required `timestamptz`, default `now()` |

The seven application answers are industry, annual revenue, monthly ad spend, growth bottleneck, partnership readiness, decision-maker email, and LinkedIn profile. Legal name is a separate required field and is limited to 255 characters by server validation and the form. New submissions are stored as `pending_review`; historical qualified/rejected statuses and rejection reasons remain available for administrator review. No application answer automatically determines qualification or rejection.

The migration enables RLS, creates no public/anon/authenticated policies, revokes table access from `PUBLIC`, `anon`, and `authenticated`, grants access to `service_role`, and includes assertions for those controls. This describes the migration only: application of the migration and live database grants/policies must be verified against the target Supabase project. The README contains SQL verification queries.

The email-verification database foundation is defined in migrations `202610270002_email_verification_database_foundation.sql` and `202610270003_idempotent_application_submissions.sql`. Existing applications remain unverified and receive no jobs. Jobs hold the SHA-256 token hash and a versioned AES-256-GCM encrypted token payload as PostgreSQL `bytea`; payload bytes are version `0x01`, 12-byte nonce, 16-byte authentication tag, then ciphertext. The key is a strict base64 encoding of 32 random bytes in server-only `EMAIL_TOKEN_ENCRYPTION_KEY`. Generate locally with `node -e 'console.log(require("node:crypto").randomBytes(32).toString("base64"))'`; configure a distinct production key. Losing or rotating it makes pending encrypted jobs unreadable unless a deliberate key-rotation process preserves access to old keys. Never place key values in this repository.

`public.create_application_with_email_job` is a `SECURITY INVOKER` RPC granted only to `service_role`. It serializes same-key calls with a transaction-scoped advisory lock, compares a server-computed SHA-256 fingerprint over a fixed-order JSON array of validated application fields, returns the original IDs/generation/status on a matching retry, and raises SQLSTATE `LGL01` on a fingerprint mismatch. Migration 003 checks that the invoker role has application INSERT and email-job SELECT/INSERT privileges; the base application migration and email-job migration revoke public/`anon`/`authenticated` table access and enable RLS. The API maps only `LGL01` to HTTP 409. Supabase's installed PostgREST client exposes the returned SQLSTATE as `error.code` (`@supabase/postgrest-js` `PostgrestError`); live role grants and RLS still require verification in Supabase. The form holds its key in memory across failed attempts, reuses it for a retry, clears it on success, and starts a new key when the user edits the form. API persistence still returns without sending email. Database shape checks require the v1 AES-GCM payload to be exactly 72 bytes and start with version byte 1; GCM authentication itself is checked during server-side decryption. Token material should remain available through transient delivery failures and may be cleared only after a definitive terminal delivery outcome and the retry/receipt policy confirms no resend is needed; no cleanup behavior is implemented here. Neither email-verification migration has been applied to a Supabase environment. To verify later on a disposable Supabase/PostgreSQL database, apply migrations 002 and 003 in order; call the final RPC twice concurrently with identical key/fingerprint and confirm both return one original application/job pair; repeat with changed data and expect `LGL01` with no row changes; test malformed 32-byte values, expiry, and 72-byte/version payload validation; then inspect `has_table_privilege` and `has_function_privilege` for `service_role`, `anon`, and `authenticated`.

The final RPC migration also asserts public-schema USAGE, application INSERT/SELECT, email-job SELECT/INSERT, RPC/advisory-lock EXECUTE, and `service_role` `BYPASSRLS`; those assertions have not been executed against Supabase. Verify the live service-role grants, RLS bypass, and anon/authenticated denials when applying both migrations to a disposable PostgreSQL/Supabase database.

## 5. Authentication and Security Decisions

### Intended policy

Administrator accounts are created manually in Firebase Console → Authentication → Add user. Firebase is used exclusively for administrators. Under the current intended policy, any verified Firebase account is an administrator. There is no public registration, `ADMIN_EMAILS` allowlist, or custom-claims requirement. Server-side authentication, session protection, and CSRF/origin protections must remain in place.

### Actual implementation discrepancy

Current code requires both `email_verified === true` and a normalized email present in server-side `ADMIN_EMAILS` at session creation and on every protected session read (`lib/admin-email-allowlist.ts`, `app/api/admin/session/route.ts`, `lib/admin-session.ts`). Missing/empty allowlist denies access. This differs from the intended verified-account policy. The login UI permits sign-in and verification but does not itself provision users. Do not treat intended policy as implemented; reconcile in a separately scoped implementation task.

### Existing protections and environment variables

- Admin session creation/logout require matching Origin; cookie is HTTP-only, Strict SameSite, production Secure, five-day lifetime. Session verification checks revocation. Login token body is size-limited. Application submission validates input and body size and redacts submitted data in diagnostic errors.
- Supabase RLS/grant protections are defined by the migration. The service-role API path intentionally bypasses RLS. The public submission handler has no rate limit or CAPTCHA in inspected code (also noted in `docs/codebase-investigation/security/firebase-admin-auth-audit.md`).
- `SUPABASE_URL`: server Supabase project URL. `SUPABASE_SERVICE_ROLE_KEY`: server-only privileged key for inserts.
- `EMAIL_TOKEN_ENCRYPTION_KEY`: server-only base64-encoded 32-byte key used for email verification token encryption; use a distinct production key and preserve old keys for pending jobs during rotation.
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase Web SDK configuration exposed to the browser.
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`: server-side Firebase Admin service-account configuration; private key must remain secret.
- `ADMIN_EMAILS`: current server-side comma-separated authorization allowlist, despite not being part of intended policy.

Names and purposes above are verified in `.env.example`, README, and source; no secret values or `.env` contents are documented. Actual environment values, scopes, account state, deployed settings, and whether the migration ran are unverified. `.env.example` contains placeholder allowlist values; these are not proof of production configuration.

## 6. Current Implementation Status

Confirmed in source:

- Public website routes and application submission/validation/qualification path exist.
- The home page Selected Work section uses four logical project cards in circular order, with a centered active card and its two circular neighbors shown as grayscale/dim previews. Direct selection, keyboard and arrow navigation, four progress controls, and horizontal wheel/touch gestures remain wired to one active index. Source content and order remain unchanged. Build and interactive browser verification remain pending; the local build currently cannot fetch its Google Fonts.
- Supabase table migration and restrictive RLS/grant setup exist in the repository.
- Email-verification database foundation, submission RPC integration, and migration/token contract tests are present in the repository; provider delivery, workers, verification UI, and live database validation remain unimplemented.
- New application submissions receive `pending_review`; a follow-up migration expands the status constraint and changes the database default while retaining historical statuses/rejection reasons. The admin list displays pending status alongside historical decisions.
- Firebase login, email verification, server token verification, session cookie, protected admin page, and logout exist.
- Phase 2 application details are implemented in the repository. `GET /api/admin/applications/[id]` verifies the administrator session on each request, validates a UUID, and returns only the selected record's submission fields and persisted qualification outcome with no-store headers. Live access remains dependent on existing Firebase, Supabase, and deployment configuration.
- `/admin` redirects authorized sessions to `/admin/dashboard`. The dashboard displays three summary metrics, an all-time qualified/rejected breakdown (green for qualified, red for rejected), and a read-only paginated applications table with validated LinkedIn and email contact links. Selecting the legal name opens a responsive, keyboard-operable application detail dialog without changing pagination; it displays stored submission answers, persisted status, and mapped stored rejection reasons.
- Dashboard metrics use exact database counts and persisted statuses. The rolling seven-day window is calculated from server UTC time. API responses are no-store and use safe error messages.
- Tests covering application validation, admin-auth behavior, dashboard route/API contracts, and multilingual i18n configuration/dictionaries pass.
- Complete multilingual localization implemented in the repository supporting 5 languages: English (en, default), Hindi (hi), Marathi (mr), Spanish (es), and German (de).
  - Language selector added to the header immediately following the Contact Us / CTA button, and integrated into mobile navigation.
  - Localized routing implemented via Next.js App Router dynamic route segments under `app/[locale]/` while preserving canonical root English URLs (`/`, `/about`, `/contact`, `/application-received`, `/work`).
  - Full translation dictionaries created for all 5 languages without placeholders, covering navigation, hero, services, selected work, about/founder/milestones/principles, contact form questions and options, confirmation, footer, and SEO metadata with `hreflang` alternate links.
  - Form submission preserves canonical database enum values to guarantee 100% database constraint and server-validation compatibility across all languages.
  - Page-level SEO metadata and root layout title template (`%s | Little Giant Labs`) reconciled: home page metadata specifies an absolute title of `Little Giant Labs` to eliminate tagline pollution and duplicate brand suffixes, while child pages use clean localized section titles that render seamlessly with the layout template.
- The `/work` page and localized work routes render six projects listed on Bhairava Media's public portfolio through `CaseStudyGrid.tsx`. The page attributes the entries to that source and states that Little Giant Labs' role and authorization to present them as LGL work are unconfirmed. The grid, list, search, category filters, and project dialog use the site theme tokens. Project media is omitted pending rights confirmation; unsubstantiated result badges and expanded narratives are not shown. The shared home portfolio modal likewise omits those unsupported claims.
- Refresh scroll restoration and section stabilization implemented:
  - `SmoothScroll.tsx` configures `window.history.scrollRestoration = "manual"` to eliminate stale native browser scroll jumps.
  - GSAP `ScrollTrigger.clearScrollMemory()` invoked on registration and window unload to prevent ScrollTrigger from restoring recorded scroll positions.
  - Page refresh and client route changes reliably load from top (`y = 0`) unless a specific anchor hash (e.g. `#services`, `#our-work`) is intentionally targeted in the URL.
- Homepage hero refined: removed "The growth system" indicator and decorative line element while rebalancing hero vertical padding to maintain premium visual centering without awkward gaps.
- Spacing and UX improvements: added `overflow-x: clip` to prevent horizontal jitter on mobile, consistent clearance below the floating pill header on child pages, and proper vertical spacing above carousel controls.
- Header logo (`components/layout/Header.tsx`): theme-specific portrait mark (`new-logo-readable.png` / `-dark.png`) on the left (inset an extra 116px at ≥1280px); controls on the right; nav centered at ≥1280px. A single portrait mark (theme variants swapped by CSS) is 88/100/128px (base/md/xl) at the top and smoothly shrinks to 60/64/72px after 12px of scroll while the header padding compacts; inner pages use `xl:pt-40` for clearance. Nav and controls are vertically centered on the logo. The fixed header is transparent at the top and gets a full-width `bg-lgl-bg` backdrop (no box, border, or radius) after 12px of scroll or while the mobile menu is open, so content scrolls cleanly beneath it. At ≥1280px the right header column is at least max-content wide so the CTA never wraps.
- Footer (`components/layout/Footer.tsx`): no logo image; the brand column is a "brand statement" card with the localized `footer.brandTagline` revealed word by word (final word in metallic-gold serif italic, `.lgl-tagline-accent`). The office address lives in `siteConfig.address` (`lib/site.ts`) and is shown, linked to Google Maps, in the footer Office column and in an Office card in the contact page sidebar.

Git state at inspection: pre-existing modification to `.gitignore`; it was not changed for this task. Latest commit shown was `d19e586`.

## 7. Development Roadmap

Planning only; no phase is marked complete based on plans.

- **Phase 1:** Connect the existing admin dashboard to Supabase, implement the protected applications API, show total and rolling seven-day volume metrics with an all-time qualification breakdown, and build a paginated, newest-first applications table. **Status: implemented in repository; production database and deployment behavior not verified.**
- **Phase 2:** Add application details and server-side filters. **Status: application detail side panel implemented; server-side filters remain unimplemented.**
- **Phase 3:** Add secure CSV export for records matching active filters. **Status: not implemented.**
- **Phase 4:** Complete security hardening, tests, deployment verification, and production checks. **Status: pending.**

## 8. Known Issues and Unresolved Questions

- Authorization policy discrepancy: intended verified-Firebase-account access versus implemented `ADMIN_EMAILS` allowlist.
- Whether the checked-in migration is applied and actual live RLS policies/table grants are as expected is unknown.
- Dashboard schema and access behavior are based on the checked-in migration; live Supabase grants, RLS state, and data were not queried.
- Vercel deployment existence, environment variable values/scopes, and production behavior are not verified.
- Firebase sign-in settings, verified admin accounts, service-account permissions, and project alignment are not verified.
- Public submission abuse controls such as rate limiting/CAPTCHA were not found in the inspected handler; decide whether and how to address in a security-hardening task.
- Favicon/app icons (`favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-*.png`) contain the wide wordmark letterboxed into a square and are illegible at tab size; no square brand icon exists in `public/`. A designer-supplied square mark is needed.

## 9. Maintenance Instructions

Update this document when architecture, security decisions, implementation status, or the next milestone materially changes. Verify claims against source/configuration first; label live/external facts as unverified unless checked. Keep stable decisions, concise status, and next milestones. Do not paste source files, full prompts, long logs, secret values, or exhaustive file listings here. Keep coding instructions in the root `AGENTS.md`; read this detailed context only when relevant to the task.
