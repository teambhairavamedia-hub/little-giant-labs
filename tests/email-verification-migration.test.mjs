import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { applicationOptions } from "../lib/application-options.ts";

const migration = await readFile(
  new URL("../supabase/migrations/202610270002_email_verification_database_foundation.sql", import.meta.url),
  "utf8",
);
const priorQualificationMigration = await readFile(
  new URL("../supabase/migrations/202610270001_add_pending_review_status.sql", import.meta.url),
  "utf8",
);
const idempotencyMigration = await readFile(
  new URL("../supabase/migrations/202610270003_idempotent_application_submissions.sql", import.meta.url),
  "utf8",
);
const enquiryMigration = await readFile(
  new URL("../supabase/migrations/202610290001_contact_enquiry_fields.sql", import.meta.url),
  "utf8",
);
const finalEnquiryMigration = await readFile(
  new URL("../supabase/migrations/202610300001_contact_role_and_simplified_enquiry_rpc.sql", import.meta.url),
  "utf8",
);

test("migration adds verification state without verifying historical applications or generating their jobs", () => {
  assert.match(migration, /add column email_verified_at timestamptz\s*,\s*add column email_verification_generation integer not null default 1/i);
  assert.match(migration, /email_verification_generation > 0/i);
  assert.doesNotMatch(migration.split("create or replace function public.create_application_with_email_job")[0], /insert into public\.email_jobs/i);
});

test("job schema enforces lifecycle, positive generations, nonnegative attempts, and operation uniqueness", () => {
  assert.match(migration, /create table public\.email_jobs/i);
  for (const status of ["pending_dispatch", "queued", "processing", "retryable", "sent", "failed_permanent", "superseded"]) {
    assert.match(migration, new RegExp(`'${status}'`));
  }
  assert.match(migration, /generation integer not null check \(generation > 0\)/i);
  assert.match(migration, /attempt_count integer not null default 0 check \(attempt_count >= 0\)/i);
  assert.match(migration, /unique \(application_id, generation\)/i);
  assert.match(migration, /unique \(idempotency_key\)/i);
  assert.match(migration, /token_hash bytea check \(token_hash is null or octet_length\(token_hash\) = 32\)/i);
  assert.match(migration, /token_hash is null and token_expires_at is null/i);
  assert.match(migration, /token_hash is not null and token_expires_at is not null/i);
});

test("transactional RPC inserts existing application fields and its initial job with a restricted contract", () => {
  const rpc = migration.slice(migration.indexOf("create or replace function public.create_application_with_email_job"));
  for (const field of [
    "legal_name", "industry_vertical", "ttm_revenue", "monthly_ad_spend",
    "growth_bottleneck", "partnership_readiness", "decision_maker_email", "decision_maker_linkedin",
  ]) {
    assert.match(rpc, new RegExp(`p_${field}`, "i"));
  }
  assert.match(rpc, /insert into public\.growth_applications[\s\S]*?returning id, email_verification_generation/i);
  assert.match(rpc, /insert into public\.email_jobs[\s\S]*?'pending_dispatch'[\s\S]*?p_idempotency_key/i);
  assert.match(rpc, /returns table \([\s\S]*?application_id uuid,[\s\S]*?email_job_id uuid,[\s\S]*?generation integer,[\s\S]*?job_status text/i);
  const applicationInsert = rpc.match(/insert into public\.growth_applications \(([\s\S]*?)\) values/i)?.[1] ?? "";
  assert.doesNotMatch(applicationInsert, /qualification_status/i);
  assert.match(rpc, /revoke all on function public\.create_application_with_email_job[\s\S]*?from public, anon, authenticated/i);
  assert.match(rpc, /grant execute on function public\.create_application_with_email_job[\s\S]*?to service_role/i);
  assert.match(rpc, /language plpgsql\s+security invoker\s+set search_path = pg_catalog/i);
  assert.doesNotMatch(rpc, /security\s+definer/i);
});

test("migration restricts email-job table access and preserves qualification behavior", () => {
  assert.match(migration, /alter table public\.email_jobs enable row level security/i);
  assert.match(migration, /revoke all on table public\.email_jobs from public, anon, authenticated/i);
  assert.match(migration, /grant all on table public\.email_jobs to service_role/i);
  assert.match(priorQualificationMigration, /alter column qualification_status set default 'pending_review'/i);
  assert.match(priorQualificationMigration, /check \(qualification_status in \('qualified', 'rejected', 'pending_review'\)\)/i);
  assert.doesNotMatch(migration, /alter column qualification_status|qualification_status_check/i);
});

test("forward migration fingerprints requests and serializes same-key retries atomically", () => {
  assert.match(idempotencyMigration, /add column request_fingerprint bytea not null\s+check \(octet_length\(request_fingerprint\) = 32\)/i);
  assert.match(idempotencyMigration, /pg_advisory_xact_lock[\s\S]*hashtextextended\(p_idempotency_key, 0\)/i);
  assert.match(idempotencyMigration, /where j\.idempotency_key = p_idempotency_key/i);
  assert.match(idempotencyMigration, /v_fingerprint is distinct from p_request_fingerprint/i);
  assert.match(idempotencyMigration, /return query select v_application_id, v_email_job_id, v_generation, v_job_status/i);
  assert.match(idempotencyMigration, /insert into public\.growth_applications[\s\S]*insert into public\.email_jobs/i);
  assert.match(idempotencyMigration, /grant execute on function public\.create_application_with_email_job[\s\S]*to service_role/i);
  assert.match(idempotencyMigration, /errcode = 'LGL01'/i);
  assert.doesNotMatch(idempotencyMigration, /errcode = 'P0001'/i);
  assert.match(idempotencyMigration, /octet_length\(p_encrypted_token_payload\) <> 72/i);
  assert.match(idempotencyMigration, /get_byte\(p_encrypted_token_payload, 0\) <> 1/i);
  assert.match(idempotencyMigration, /service_role', 'public\.growth_applications', 'INSERT'/i);
  assert.match(idempotencyMigration, /service_role', 'public\.email_jobs', 'SELECT'/i);
  assert.match(idempotencyMigration, /has_schema_privilege\('service_role', 'public', 'USAGE'\)/i);
  assert.match(idempotencyMigration, /pg_catalog\.pg_advisory_xact_lock\(bigint\)/i);
  assert.match(idempotencyMigration, /pg_catalog\.hashtextextended\(text,bigint\)/i);
  assert.match(idempotencyMigration, /security invoker\s+set search_path = pg_catalog/i);
  assert.doesNotMatch(idempotencyMigration, /security\s+definer/i);
  assert.match(idempotencyMigration, /p_token_hash is null[\s\S]*octet_length\(p_token_hash\) <> 32/i);
  assert.match(idempotencyMigration, /p_token_expires_at is null or p_token_expires_at <= pg_catalog\.now\(\)/i);
  assert.match(idempotencyMigration, /p_request_fingerprint is null or pg_catalog\.octet_length\(p_request_fingerprint\) <> 32/i);
  assert.match(idempotencyMigration, /p_idempotency_key is null or pg_catalog\.length\(pg_catalog\.btrim\(p_idempotency_key\)\) = 0/i);
});

test("final RPC signature (forward migration) matches all 12 named arguments in the application call", async () => {
  const route = await readFile(new URL("../app/api/applications/route.ts", import.meta.url), "utf8");
  const helper = await readFile(new URL("../lib/application-verification.ts", import.meta.url), "utf8");
  const signature = finalEnquiryMigration.match(/create function public\.create_application_with_email_job\(([\s\S]*?)\)\s*returns table/i)?.[1] ?? "";
  const args = [...signature.matchAll(/\b(p_[a-z_]+)\s+(text|bytea|timestamptz)\b/gi)].map((match) => [match[1], match[2].toLowerCase()]);
  const expected = [
    ["p_contact_name", "text"], ["p_decision_maker_email", "text"], ["p_legal_name", "text"],
    ["p_contact_role", "text"], ["p_help_with", "text"], ["p_project_details", "text"], ["p_timeline", "text"],
    ["p_token_hash", "bytea"], ["p_token_expires_at", "timestamptz"], ["p_encrypted_token_payload", "bytea"],
    ["p_idempotency_key", "text"], ["p_request_fingerprint", "bytea"],
  ];
  assert.deepEqual(args, expected);
  for (const [name] of expected) assert.match(helper, new RegExp(`${name}:`));
  assert.match(route, /buildCreateApplicationWithEmailJobArgs\(application, metadata\)/);
  assert.match(enquiryMigration, /returns table \(application_id uuid, email_job_id uuid, generation integer, job_status text\)/i);
  assert.match(finalEnquiryMigration, /drop function public\.create_application_with_email_job\(\s*text, text, text, text, text, text, text, text, text,\s*bytea, timestamptz, bytea, text, bytea\s*\)/i);
});

test("final RPC stores only the seven consultation fields and keeps verification infrastructure", () => {
  const rpc = finalEnquiryMigration.slice(finalEnquiryMigration.indexOf("create function public.create_application_with_email_job"));
  assert.match(finalEnquiryMigration, /add column contact_role text[\s\S]*'Founder \/ Owner'[\s\S]*'Other'/i);
  assert.match(rpc, /p_contact_name is null[\s\S]*p_decision_maker_email is null[\s\S]*p_legal_name is null[\s\S]*p_help_with is null[\s\S]*p_project_details is null/i);
  assert.match(rpc, /nullif\(pg_catalog\.btrim\(p_contact_role\), ''\)/i);
  assert.match(rpc, /nullif\(pg_catalog\.btrim\(p_timeline\), ''\)/i);
  assert.match(rpc, /insert into public\.growth_applications[\s\S]*insert into public\.email_jobs/i);
  assert.doesNotMatch(rpc.slice(rpc.indexOf("insert into public.growth_applications"), rpc.indexOf("returning id, email_verification_generation")), /company_size|industry_vertical|budget_range/i);
  assert.match(rpc, /pg_advisory_xact_lock[\s\S]*v_fingerprint is distinct from p_request_fingerprint[\s\S]*errcode = 'LGL01'/i);
  assert.match(rpc, /revoke all on function[\s\S]*from public, anon, authenticated/i);
  assert.match(rpc, /grant execute on function[\s\S]*to service_role/i);
});

test("enquiry migration keeps legacy rows valid and restricts new answers to the shared option lists", () => {
  for (const column of ["industry_vertical", "ttm_revenue", "monthly_ad_spend", "growth_bottleneck", "partnership_readiness", "decision_maker_linkedin"]) {
    assert.match(enquiryMigration, new RegExp(`alter column ${column} drop not null`, "i"));
  }
  for (const column of ["contact_name", "help_with", "project_details", "company_size", "budget_range", "timeline"]) {
    assert.match(enquiryMigration, new RegExp(`add column ${column} text`, "i"));
  }
  // Help and timeline existed in this migration; later role support is forward-only.
  for (const option of [...applicationOptions.help_with, ...applicationOptions.timeline]) assert.ok(enquiryMigration.includes(`'${option}'`), option);
  for (const legacy of ["Enterprise Banking & FinTech", "High-Ticket B2B Services"]) assert.ok(enquiryMigration.includes(`'${legacy}'`), legacy);
  assert.match(enquiryMigration, /char_length\(contact_name\) between 1 and 120/i);
  assert.match(enquiryMigration, /char_length\(project_details\) between 1 and 2000/i);
});

test("enquiry RPC keeps the restricted, idempotent contract and requires the enquiry answers", () => {
  const rpc = enquiryMigration.slice(enquiryMigration.indexOf("create function public.create_application_with_email_job"));
  assert.match(rpc, /language plpgsql\s+security invoker\s+set search_path = pg_catalog/i);
  assert.doesNotMatch(rpc, /security\s+definer/i);
  assert.match(rpc, /p_contact_name is null[\s\S]*p_help_with is null[\s\S]*p_project_details is null/i);
  assert.match(rpc, /pg_advisory_xact_lock[\s\S]*hashtextextended\(p_idempotency_key, 0\)/i);
  assert.match(rpc, /v_fingerprint is distinct from p_request_fingerprint/i);
  assert.match(rpc, /errcode = 'LGL01'/i);
  assert.match(rpc, /octet_length\(p_encrypted_token_payload\) <> 72/i);
  const applicationInsert = rpc.match(/insert into public\.growth_applications \(([\s\S]*?)\) values/i)?.[1] ?? "";
  assert.doesNotMatch(applicationInsert, /qualification_status/i);
  assert.match(rpc, /revoke all on function public\.create_application_with_email_job[\s\S]*?from public, anon, authenticated/i);
  assert.match(rpc, /grant execute on function public\.create_application_with_email_job[\s\S]*?to service_role/i);
  assert.match(rpc, /create_application_with_email_job\(text,text,text,text,text,text,text,text,text,bytea,timestamptz,bytea,text,bytea\)/i);
});

test("final migration documentation no longer describes duplicate-key uniqueness failure", () => {
  assert.doesNotMatch(migration, /expect unique_violation|collisions fail the RPC/i);
  assert.match(migration, /Migration 003 replaces this initial RPC/i);
  assert.match(idempotencyMigration, /matching-retry/i);
  assert.match(idempotencyMigration, /mismatched-payload/i);
});
