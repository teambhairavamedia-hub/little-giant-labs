-- Email verification is independent of qualification. Existing applications
-- receive the generation default only; they remain unverified and get no jobs.
alter table public.growth_applications
  add column email_verified_at timestamptz,
  add column email_verification_generation integer not null default 1
    constraint growth_applications_email_verification_generation_positive
      check (email_verification_generation > 0);

create table public.email_jobs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null
    references public.growth_applications (id) on delete cascade,
  generation integer not null check (generation > 0),
  status text not null default 'pending_dispatch'
    check (status in (
      'pending_dispatch', 'queued', 'processing', 'retryable', 'sent',
      'failed_permanent', 'superseded'
    )),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  available_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lease_until timestamptz,
  published_at timestamptz,
  sent_at timestamptz,
  -- SHA-256 is represented as exactly 32 bytes; plaintext tokens are never stored.
  token_hash bytea check (token_hash is null or octet_length(token_hash) = 32),
  token_expires_at timestamptz,
  encrypted_token_payload bytea check (
    case
      when encrypted_token_payload is null then true
      when octet_length(encrypted_token_payload) <> 72 then false
      else get_byte(encrypted_token_payload, 0) = 1
    end
  ),
  safe_error_category text,
  qstash_message_id text,
  idempotency_key text not null check (length(btrim(idempotency_key)) > 0),
  constraint email_jobs_application_generation_unique unique (application_id, generation),
  constraint email_jobs_idempotency_key_unique unique (idempotency_key),
  constraint email_jobs_token_expiry_pair check (
    (token_hash is null and token_expires_at is null)
    or (token_hash is not null and token_expires_at is not null)
  )
);

-- The per-generation unique constraint permits administrator resends as new
-- generations while preventing two jobs for the same application generation.
-- Idempotency keys are globally scoped. Migration 003 replaces this initial RPC
-- with matching-retry and mismatched-payload handling before the API is enabled.
create index email_jobs_pending_dispatch_available_idx
  on public.email_jobs (available_at, created_at)
  where status = 'pending_dispatch';

create index email_jobs_retryable_available_idx
  on public.email_jobs (available_at, created_at)
  where status = 'retryable';

create index email_jobs_processing_lease_idx
  on public.email_jobs (lease_until)
  where status = 'processing';

-- The unique application/generation index also supports this lookup.

create or replace function public.touch_email_job_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create trigger email_jobs_touch_updated_at
before update on public.email_jobs
for each row execute function public.touch_email_job_updated_at();

alter table public.email_jobs enable row level security;
revoke all on table public.email_jobs from public, anon, authenticated;
grant all on table public.email_jobs to service_role;

-- Invoker-security RPC: it runs as the caller, relies on the existing
-- service_role-only table grants, and never publishes to an external queue.
create or replace function public.create_application_with_email_job(
  p_legal_name text,
  p_industry_vertical text,
  p_ttm_revenue text,
  p_monthly_ad_spend text,
  p_growth_bottleneck text,
  p_partnership_readiness text,
  p_decision_maker_email text,
  p_decision_maker_linkedin text,
  p_token_hash bytea,
  p_token_expires_at timestamptz,
  p_encrypted_token_payload bytea,
  p_idempotency_key text
)
returns table (
  application_id uuid,
  email_job_id uuid,
  generation integer,
  job_status text
)
language plpgsql
security invoker
set search_path = pg_catalog
as $$
declare
  v_application_id uuid;
  v_generation integer;
  v_email_job_id uuid;
  v_job_status text;
begin
  if p_token_hash is null or pg_catalog.octet_length(p_token_hash) <> 32 then
    raise exception using errcode = '22023', message = 'A 32-byte token hash is required.';
  end if;
  if p_encrypted_token_payload is null then
    raise exception using errcode = '22023', message = 'A valid versioned encrypted token payload is required.';
  end if;
  if pg_catalog.octet_length(p_encrypted_token_payload) <> 72 then
    raise exception using errcode = '22023', message = 'A valid versioned encrypted token payload is required.';
  end if;
  if pg_catalog.get_byte(p_encrypted_token_payload, 0) <> 1 then
    raise exception using errcode = '22023', message = 'A valid versioned encrypted token payload is required.';
  end if;
  if p_token_expires_at is null or p_token_expires_at <= pg_catalog.now() then
    raise exception using errcode = '22023', message = 'Token expiry must be in the future.';
  end if;
  if p_idempotency_key is null or pg_catalog.length(pg_catalog.btrim(p_idempotency_key)) = 0 then
    raise exception using errcode = '22023', message = 'A non-empty idempotency key is required.';
  end if;

  insert into public.growth_applications (
    legal_name,
    industry_vertical,
    ttm_revenue,
    monthly_ad_spend,
    growth_bottleneck,
    partnership_readiness,
    decision_maker_email,
    decision_maker_linkedin
  ) values (
    p_legal_name,
    p_industry_vertical,
    p_ttm_revenue,
    p_monthly_ad_spend,
    p_growth_bottleneck,
    p_partnership_readiness,
    p_decision_maker_email,
    p_decision_maker_linkedin
  )
  returning id, email_verification_generation
    into v_application_id, v_generation;

  insert into public.email_jobs (
    application_id,
    generation,
    status,
    token_hash,
    token_expires_at,
    encrypted_token_payload,
    idempotency_key
  ) values (
    v_application_id,
    v_generation,
    'pending_dispatch',
    p_token_hash,
    p_token_expires_at,
    p_encrypted_token_payload,
    p_idempotency_key
  )
  returning id, status into v_email_job_id, v_job_status;

  return query select v_application_id, v_email_job_id, v_generation, v_job_status;
end;
$$;

revoke all on function public.create_application_with_email_job(
  text, text, text, text, text, text, text, text, bytea, timestamptz, bytea, text
) from public, anon, authenticated;
grant execute on function public.create_application_with_email_job(
  text, text, text, text, text, text, text, text, bytea, timestamptz, bytea, text
) to service_role;

-- Trigger functions do not provide an RPC surface; keep direct execution private.
revoke all on function public.touch_email_job_updated_at() from public, anon, authenticated;

do $$
begin
  if not (
    select relrowsecurity from pg_class
    where oid = 'public.email_jobs'::regclass
  ) then
    raise exception 'RLS must be enabled on public.email_jobs';
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'email_jobs'
      and roles && array['public', 'anon', 'authenticated']::name[]
  ) then
    raise exception 'Remove public, anon, and authenticated policies from email_jobs';
  end if;

  if has_table_privilege('anon', 'public.email_jobs', 'SELECT')
     or has_table_privilege('anon', 'public.email_jobs', 'INSERT')
     or has_table_privilege('anon', 'public.email_jobs', 'UPDATE')
     or has_table_privilege('anon', 'public.email_jobs', 'DELETE')
     or has_table_privilege('authenticated', 'public.email_jobs', 'SELECT')
     or has_table_privilege('authenticated', 'public.email_jobs', 'INSERT')
     or has_table_privilege('authenticated', 'public.email_jobs', 'UPDATE')
     or has_table_privilege('authenticated', 'public.email_jobs', 'DELETE') then
    raise exception 'anon and authenticated must not have table access to email_jobs';
  end if;

  if has_function_privilege('anon', 'public.create_application_with_email_job(text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.create_application_with_email_job(text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text)', 'EXECUTE') then
    raise exception 'anon and authenticated must not be able to execute the application/job RPC';
  end if;
end;
$$;

-- Manual database integration checks (run only against a disposable test DB):
-- 1. Snapshot existing application IDs, apply this migration, and confirm all
--    prior rows have email_verified_at IS NULL and no matching email_jobs rows.
-- 2. Call create_application_with_email_job with valid application values, a
--    32-byte hash, a future expiry, and a fresh idempotency key; confirm exactly
--    one application and one generation-1 pending_dispatch job exist.
-- 3. After applying migration 003, repeat the same request/key and confirm the
--    original result is returned without another application or job. Reusing
--    the key with a different fingerprint must raise the dedicated conflict.
-- 4. Force a job insert constraint failure in a disposable test copy and confirm
--    the application inserted by that function call rolls back.
-- 5. Confirm generation 0 is rejected, public/anon/authenticated have no job
--    table privileges or RPC execute permission, and service_role can execute.
-- 6. Confirm growth_applications qualification_status remains default
--    'pending_review' with its existing qualified/rejected/pending_review check.
