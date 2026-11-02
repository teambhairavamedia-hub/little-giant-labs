-- Optional phone / WhatsApp number on enquiries, stored in E.164 form ("+919876543210").
-- Deploy after 202610300001_contact_role_and_simplified_enquiry_rpc.sql, and apply this migration before
-- deploying the website code that sends p_contact_phone.
--
-- The 12-argument RPC from the previous migration is kept, so the currently deployed site keeps working until the
-- new code is live. PostgREST picks the overload by argument names. Once the new code is deployed, the old
-- overload can be dropped in a later migration.

alter table public.growth_applications
  add column contact_phone text
    check (contact_phone is null or contact_phone ~ '^\+[1-9][0-9]{6,14}$');

create function public.create_application_with_email_job(
  p_contact_name text,
  p_decision_maker_email text,
  p_legal_name text,
  p_contact_role text,
  p_help_with text,
  p_project_details text,
  p_timeline text,
  p_contact_phone text,
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
  if p_encrypted_token_payload is null or pg_catalog.octet_length(p_encrypted_token_payload) <> 72
     or pg_catalog.get_byte(p_encrypted_token_payload, 0) <> 1 then
    raise exception using errcode = '22023', message = 'A valid versioned encrypted token payload is required.';
  end if;
  if p_idempotency_key is null or pg_catalog.length(pg_catalog.btrim(p_idempotency_key)) = 0 then
    raise exception using errcode = '22023', message = 'A non-empty idempotency key is required.';
  end if;

  -- Same-key requests serialize; identical fingerprints return the original pair,
  -- while changed requests retain the established LGL01 conflict semantics.
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
    contact_name, decision_maker_email, legal_name, contact_role,
    help_with, project_details, timeline, contact_phone
  ) values (
    p_contact_name, p_decision_maker_email, p_legal_name, nullif(pg_catalog.btrim(p_contact_role), ''),
    p_help_with, p_project_details, nullif(pg_catalog.btrim(p_timeline), ''), nullif(pg_catalog.btrim(p_contact_phone), '')
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
  text, text, text, text, text, text, text, text, bytea, timestamptz, bytea, text, bytea
) from public, anon, authenticated;
grant execute on function public.create_application_with_email_job(
  text, text, text, text, text, text, text, text, bytea, timestamptz, bytea, text, bytea
) to service_role;

do $$
begin
  if not has_function_privilege(
    'service_role',
    'public.create_application_with_email_job(text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text,bytea)',
    'EXECUTE'
  ) then
    raise exception 'service_role must be able to execute the application/job RPC';
  end if;
  if has_function_privilege('anon', 'public.create_application_with_email_job(text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text,bytea)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.create_application_with_email_job(text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text,bytea)', 'EXECUTE') then
    raise exception 'anon and authenticated must not be able to execute the application/job RPC';
  end if;
end;
$$;
