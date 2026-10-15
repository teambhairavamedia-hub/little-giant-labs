# Little Giant Labs

The company's landing page, built with Next.js and React. The site includes company, work, and contact pages, along with an application form that submits to a server-side API route backed by Supabase.

## Prerequisites & Getting Started

- Node.js compatible with the Next.js 16 project
- npm
- Supabase project credentials for submitting applications to a live database

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Configure the Supabase environment variables below and apply the database migration to enable application submissions.

## Environment Variables

Set these variables for local development and in Vercel environments where submissions should be enabled:

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key used by the server route to insert submissions. |

The service-role key must remain server-side. Never expose it in browser code, use a `NEXT_PUBLIC_` variable for it, or commit it to Git. Keep local values in an untracked environment file such as `.env.local`.

## Application Submissions (Supabase)

The form sends JSON to `POST /api/applications`. The server validates required fields and allowed answer values, trims the legal name, normalizes the decision-maker email, and requires a valid HTTPS LinkedIn profile URL. Consumer email providers are rejected. Qualification is calculated server-side, so submitted qualification fields cannot override it.

Applications are tagged `rejected` with one or more of these `rejection_reasons` when the applicant selects the corresponding answer:

- `ttm_revenue_below_1m` — annual revenue is under $1 million.
- `monthly_ad_spend_below_10k` — monthly ad spend is under $10,000.
- `cheap_execution_vendor` — seeking a cheap, hands-off execution vendor.

Applications without those answers are tagged `qualified`. Rejected applications are still saved with their submitted answers and structured reason codes. The route inserts the validated record into `public.growth_applications` using the Supabase service-role client. Validation errors return a client error; database failures return a safe server error, with submitted values redacted from diagnostic logs.

## Database Setup & Security Verification

Apply [`supabase/migrations/202610150001_create_growth_applications.sql`](supabase/migrations/202610150001_create_growth_applications.sql) to the intended Supabase project using the Supabase SQL Editor, or link the project with the Supabase CLI and run `supabase db push`.

The migration creates `public.growth_applications`, enables row-level security (RLS), defines no `anon` or `authenticated` policies, revokes table grants from `PUBLIC`, `anon`, and `authenticated`, and grants table privileges to `service_role`. It also includes assertions that fail if public policies or `anon`/`authenticated` table access remain. The server route uses the service-role key; do not disable RLS or add public table policies to make submissions work.

After applying the migration, run all three queries in the Supabase SQL Editor to verify the actual project's configuration:

```sql
select c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'growth_applications';

select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'growth_applications';

select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'growth_applications'
order by grantee, privilege_type;
```

Expected results: the first query reports RLS enabled; the second shows no policies granting access to `PUBLIC`, `anon`, or `authenticated`; and the third shows no `SELECT`, `INSERT`, `UPDATE`, or `DELETE` table grants for those roles, while `service_role` has the privileges needed by the API. Recheck after any automatic RLS or grant automation in the project. These instructions do not verify a deployed Supabase project's catalogs; run the queries against that project to confirm its configuration.

## Testing & Validation

Run the server-side validation and qualification tests and the lint checks with:

```bash
npm test
npm run lint
```

Live database insertion requires `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the migration applied to the target project. Database insertion is not part of the unit tests.

## Deployment & Resources

Deploy the Next.js project on [Vercel](https://vercel.com/new). Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Vercel environments that should accept submissions, and apply the migration to the intended Supabase project before enabling live insertion.

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
