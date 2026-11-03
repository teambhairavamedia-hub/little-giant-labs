// Read-only check of the Supabase setup the website needs. It never writes data and never prints secrets.
//
//   node --env-file=.env.local scripts/check-supabase.mjs
//
// It checks the connection, the enquiry table and its newer columns, and which versions of the enquiry save
// function exist. Each function check calls it with every argument empty: the function's first step rejects
// that ("Required enquiry fields are missing") before anything is inserted, so nothing is saved.
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.log("Not connected: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set (add them to .env.local).");
  process.exit(1);
}
console.log(`Project: ${new URL(url).hostname}`);
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const ok = (text) => console.log(`  OK       ${text}`);
const missing = (text) => console.log(`  MISSING  ${text}`);
let needed = [];

// Connection and table
const table = await supabase.from("growth_applications").select("id", { count: "exact", head: true });
if (table.error) {
  console.log(`Cannot read growth_applications: ${table.error.message}`);
  process.exit(1);
}
console.log("Connection and enquiry table:");
ok(`growth_applications is readable (${table.count ?? "?"} enquiries stored)`);

// Columns added by each migration
console.log("Columns:");
for (const [column, migration] of [
  ["contact_name", "202610290001_contact_enquiry_fields.sql"],
  ["contact_role", "202610300001_contact_role_and_simplified_enquiry_rpc.sql"],
  ["contact_phone", "202611020001_contact_phone.sql"],
  ["lead_source", "202611030001_lead_source.sql"],
]) {
  const { error } = await supabase.from("growth_applications").select(column, { head: true });
  if (!error) ok(column);
  else if (error.code === "42703" || /does not exist|could not find/i.test(error.message)) { missing(`${column}  (apply ${migration})`); needed.push(migration); }
  else console.log(`  ?        ${column}: ${error.message}`);
}

// Save-function versions: the website's current code calls the newest one
console.log("Enquiry save function (create_application_with_email_job):");
const base = ["p_contact_name", "p_decision_maker_email", "p_legal_name", "p_contact_role", "p_help_with", "p_project_details", "p_timeline"];
const tail = ["p_token_hash", "p_token_expires_at", "p_encrypted_token_payload", "p_idempotency_key", "p_request_fingerprint"];
for (const [label, extra, migration] of [
  ["12-argument version (before phone)", [], "202610300001_contact_role_and_simplified_enquiry_rpc.sql"],
  ["13-argument version (with phone)", ["p_contact_phone"], "202611020001_contact_phone.sql"],
  ["14-argument version (with phone and lead source)", ["p_contact_phone", "p_lead_source"], "202611030001_lead_source.sql"],
]) {
  const args = Object.fromEntries([...base, ...extra, ...tail].map((name) => [name, null]));
  const { error } = await supabase.rpc("create_application_with_email_job", args);
  if (error && (error.code === "PGRST202" || /could not find the function/i.test(error.message))) { missing(`${label}  (apply ${migration})`); needed.push(migration); }
  else if (error && (error.code === "22023" || /required enquiry fields/i.test(error.message))) ok(label);
  else console.log(`  ?        ${label}: ${error ? error.message : "unexpected success (check the table for an empty row)"}`);
}

needed = [...new Set(needed)];
console.log(needed.length
  ? `\nStill needed, in this order:\n${needed.sort().map((m) => `  - supabase/migrations/${m}`).join("\n")}`
  : "\nAll required database updates are applied.");
