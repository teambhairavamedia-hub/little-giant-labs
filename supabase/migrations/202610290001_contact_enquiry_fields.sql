-- Contact form v2: a shorter enquiry replaces the partnership application.
--   Required: contact_name, decision_maker_email (work email), legal_name (company or brand name),
--             help_with, project_details.
--   Optional: company_size, industry_vertical, budget_range, timeline (NULL when not answered).
-- The legacy qualification columns are kept for existing rows but are no longer collected, so they
-- become nullable. Allowed values mirror lib/application-options.ts.

alter table public.growth_applications
  add column contact_name text
    check (contact_name is null or pg_catalog.char_length(contact_name) between 1 and 120),
  add column help_with text
    check (help_with is null or help_with in (
      'Brand strategy & positioning',
      'Creative & content',
      'Digital marketing & growth',
      'Employer brand & talent communication',
      'Not sure yet / help me decide'
    )),
  add column project_details text
    check (project_details is null or pg_catalog.char_length(project_details) between 1 and 2000),
  add column company_size text
    check (company_size is null or company_size in (
      '1–10 people', '11–50 people', '51–200 people', '201–1,000 people', '1,000+ people'
    )),
  add column budget_range text
    check (budget_range is null or budget_range in (
      'Under $5,000', '$5,000 – $15,000', '$15,000 – $50,000', '$50,000+', 'Not sure yet'
    )),
  add column timeline text
    check (timeline is null or timeline in (
      'As soon as possible', 'Within 1–3 months', 'Within 3–6 months', 'Flexible / not decided'
    ));

alter table public.growth_applications
  alter column industry_vertical drop not null,
  alter column ttm_revenue drop not null,
  alter column monthly_ad_spend drop not null,
  alter column growth_bottleneck drop not null,
  alter column partnership_readiness drop not null,
  alter column decision_maker_linkedin drop not null;

-- Industry is optional and uses a new list; legacy values stay valid for historical rows.
alter table public.growth_applications
  drop constraint if exists growth_applications_industry_vertical_check;
alter table public.growth_applications
  add constraint growth_applications_industry_vertical_check
  check (industry_vertical is null or industry_vertical in (
    'Technology & SaaS',
    'Financial services & fintech',
    'Consumer, retail & D2C',
    'Media, entertainment & music',
    'Real estate & infrastructure',
    'Professional & B2B services',
    'Healthcare & life sciences',
    'Education',
    'Other',
    'Enterprise Banking & FinTech',
    'Heavy Infrastructure & Real Estate',
    'Premium Consumer Goods (D2C)',
    'Venture-Backed Technology',
    'High-Ticket B2B Services'
  ));

drop function public.create_application_with_email_job(
  text, text, text, text, text, text, text, text, bytea, timestamptz, bytea, text, bytea
);

create function public.create_application_with_email_job(
  p_contact_name text,
  p_decision_maker_email text,
  p_legal_name text,
  p_help_with text,
  p_project_details text,
  p_company_size text,
  p_industry_vertical text,
  p_budget_range text,
  p_timeline text,
  p_token_hash bytea,
  p_token_expires_at timestamptz,
  p_encrypted_token_payload bytea,
  p_idempotency_key text,
  p_request_fingerprint bytea
)
returns table (application_id uuid, email_job_id uuid, generation integer, job_status text)
language plpgsql
security invoker
set search_path = pg_catalog
as $$
declare
  v_application_id uuid;
  v_generation integer;
  v_email_job_id uuid;
  v_job_status text;
  v_fingerprint bytea;
begin
  -- New enquiries must carry every required answer (the columns are nullable only for legacy rows).
  if p_contact_name is null or pg_catalog.length(pg_catalog.btrim(p_contact_name)) = 0
     or p_decision_maker_email is null or pg_catalog.length(pg_catalog.btrim(p_decision_maker_email)) = 0
     or p_legal_name is null or pg_catalog.length(pg_catalog.btrim(p_legal_name)) = 0
     or p_help_with is null
     or p_project_details is null or pg_catalog.length(pg_catalog.btrim(p_project_details)) = 0 then
    raise exception using errcode = '22023', message = 'Required enquiry fields are missing.';
  end if;
  if p_token_hash is null or pg_catalog.octet_length(p_token_hash) <> 32
     or p_request_fingerprint is null or pg_catalog.octet_length(p_request_fingerprint) <> 32 then
    raise exception using errcode = '22023', message = 'Required 32-byte values are missing.';
  end if;
  if p_token_expires_at is null or p_token_expires_at <= pg_catalog.now() then
    raise exception using errcode = '22023', message = 'Token expiry must be in the future.';
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
  if p_idempotency_key is null or pg_catalog.length(pg_catalog.btrim(p_idempotency_key)) = 0 then
    raise exception using errcode = '22023', message = 'A non-empty idempotency key is required.';
  end if;

-- Matching-retry behavior (unchanged from migration 003): a same-key/same-fingerprint call returns the
-- original application/job result. A mismatched-payload retry raises LGL01.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_idempotency_key, 0));
  select j.application_id, j.id, j.generation, j.status, j.request_fingerprint
    into v_application_id, v_email_job_id, v_generation, v_job_status, v_fingerprint
    from public.email_jobs j
   where j.idempotency_key = p_idempotency_key;
  if found then
    if v_fingerprint is distinct from p_request_fingerprint then
      raise exception using errcode = 'LGL01', message = 'Idempotency key conflict';
    end if;
    return query select v_application_id, v_email_job_id, v_generation, v_job_status;
    return;
  end if;

  insert into public.growth_applications (
    contact_name, decision_maker_email, legal_name, help_with, project_details,
    company_size, industry_vertical, budget_range, timeline
  ) values (
    p_contact_name, p_decision_maker_email, p_legal_name, p_help_with, p_project_details,
    p_company_size, p_industry_vertical, p_budget_range, p_timeline
  ) returning id, email_verification_generation into v_application_id, v_generation;

  insert into public.email_jobs (
    application_id, generation, status, token_hash, token_expires_at,
    encrypted_token_payload, idempotency_key, request_fingerprint
  ) values (
    v_application_id, v_generation, 'pending_dispatch', p_token_hash, p_token_expires_at,
    p_encrypted_token_payload, p_idempotency_key, p_request_fingerprint
  ) returning id, status into v_email_job_id, v_job_status;

  return query select v_application_id, v_email_job_id, v_generation, v_job_status;
end;
$$;

revoke all on function public.create_application_with_email_job(
  text, text, text, text, text, text, text, text, text, bytea, timestamptz, bytea, text, bytea
) from public, anon, authenticated;
grant execute on function public.create_application_with_email_job(
  text, text, text, text, text, text, text, text, text, bytea, timestamptz, bytea, text, bytea
) to service_role;

do $$
begin
  if not has_schema_privilege('service_role', 'public', 'USAGE')
     or not has_table_privilege('service_role', 'public.growth_applications', 'INSERT')
     or not has_table_privilege('service_role', 'public.growth_applications', 'SELECT')
     or not has_table_privilege('service_role', 'public.email_jobs', 'INSERT')
     or not has_table_privilege('service_role', 'public.email_jobs', 'SELECT') then
    raise exception 'service_role requires application INSERT/SELECT and email_jobs SELECT/INSERT privileges';
  end if;
  if not exists (
    select 1 from pg_catalog.pg_roles
     where rolname = 'service_role' and rolbypassrls
  ) then
    raise exception 'service_role must bypass RLS for the invoker-security submission RPC';
  end if;
  if not has_function_privilege(
    'service_role',
    'public.create_application_with_email_job(text,text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text,bytea)',
    'EXECUTE'
  ) then
    raise exception 'service_role must be able to execute the application/job RPC';
  end if;
  if has_function_privilege(
    'anon',
    'public.create_application_with_email_job(text,text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text,bytea)',
    'EXECUTE'
  ) or has_function_privilege(
    'authenticated',
    'public.create_application_with_email_job(text,text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text,bytea)',
    'EXECUTE'
  ) then
    raise exception 'anon and authenticated must not be able to execute the application/job RPC';
  end if;
  if has_table_privilege('anon', 'public.growth_applications', 'SELECT')
     or has_table_privilege('anon', 'public.growth_applications', 'INSERT')
     or has_table_privilege('authenticated', 'public.growth_applications', 'SELECT')
     or has_table_privilege('authenticated', 'public.growth_applications', 'INSERT') then
    raise exception 'anon and authenticated must not have growth_applications access';
  end if;
end;
$$;
