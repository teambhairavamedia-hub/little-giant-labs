# Coding agent instructions

Little Giant Labs is a Next.js App Router website deployed on Vercel, with Supabase PostgreSQL for application submissions and Firebase Authentication plus Firebase Admin SDK for administrator authentication.

## Working principles

- Inspect only files relevant to the requested task. Read `docs/PROJECT_CONTEXT.md` when architecture or project status matters; avoid repeated full-repository audits unless justified.
- Treat implementation code and actual configuration as authoritative over documentation. Make minimal, focused changes.
- Avoid unnecessary dependencies, infrastructure, migrations, and unrelated refactoring. Preserve public website behavior unless asked to change it.
- Keep privileged credentials server-side and preserve existing security controls.
- Keep admin dashboard database reads in session-protected server routes; never expose service-role credentials to client code.
- Run relevant checks and report their actual results. Update `docs/PROJECT_CONTEXT.md` after meaningful architecture, implementation-status, or unresolved-issue changes.
- Do not implement unrequested features or refactor unrelated code.

## Administrator security policy

- Intended policy: create administrator accounts manually through Firebase Console → Authentication → Add user. Firebase is used exclusively for administrators; under the current policy, a verified Firebase account is an administrator. There is no public registration flow, and no `ADMIN_EMAILS` allowlist or custom claims are required.
- Preserve server-side authentication, session security, and CSRF/origin protections. If implementation differs from this policy, document the discrepancy and follow the task’s scope; do not silently change authorization policy.

## Scope discipline

Keep this file concise and stable. Put detailed architecture, verified implementation status, and roadmap information in `docs/PROJECT_CONTEXT.md`.
