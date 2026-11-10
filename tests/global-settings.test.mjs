import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseRetentionDays, retentionCutoff, RETENTION_MAX_DAYS } from "../lib/global-settings.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("retention accepts whole days in range, or empty to keep enquiries", () => {
  assert.deepEqual(parseRetentionDays(null), { ok: true, days: null });
  assert.deepEqual(parseRetentionDays(""), { ok: true, days: null });
  assert.deepEqual(parseRetentionDays(90), { ok: true, days: 90 });
  assert.deepEqual(parseRetentionDays(" 30 "), { ok: true, days: 30 });
  assert.deepEqual(parseRetentionDays(RETENTION_MAX_DAYS), { ok: true, days: RETENTION_MAX_DAYS });
  for (const bad of [0, -5, 1.5, "1.5", "abc", "1e3", RETENTION_MAX_DAYS + 1, true, {}, []]) {
    assert.equal(parseRetentionDays(bad).ok, false, String(bad));
  }
});

test("the clean-up cut-off is the given number of days before now", () => {
  const now = new Date("2026-11-10T00:00:00.000Z");
  assert.equal(retentionCutoff(30, now).toISOString(), "2026-10-11T00:00:00.000Z");
});

test("settings are admin-only, and the migration keeps them away from public roles", async () => {
  const route = await read("../app/api/admin/settings/route.ts");
  const migration = await read("../supabase/migrations/202611100001_global_settings.sql");
  assert.match(route, /if \(!\(await getAdminSession\(\)\)\) return fail\("Authentication is required\.", 401\)/);
  assert.ok(route.indexOf("hasSameOrigin(request)") < route.indexOf("getAdminSession()", route.indexOf("PATCH")));
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all on table public\.global_settings from public, anon, authenticated/);
  assert.match(migration, /check \(id = 1\)/);
});

test("the daily clean-up needs the cron secret and deletes nothing without a retention period", async () => {
  const cron = await read("../app/api/cron/data-retention/route.ts");
  const vercel = JSON.parse(await read("../vercel.json"));
  assert.match(cron, /if \(!secret\) return false;/);
  assert.match(cron, /timingSafeEqual/);
  assert.match(cron, /if \(!dataRetentionDays\) return json\(\{ ok: true, deleted: 0/);
  assert.match(cron, /\.lt\("submitted_at", cutoff\)/);
  assert.deepEqual(vercel.crons.map((cron) => cron.path), ["/api/cron/data-retention"]);
});

test("the robot check is enforced on the server only when both Turnstile keys are set", async () => {
  const route = await read("../app/api/applications/route.ts");
  const turnstile = await read("../lib/turnstile.ts");
  assert.match(turnstile, /Boolean\(turnstileSiteKey\(\) && process\.env\.TURNSTILE_SECRET_KEY\?\.trim\(\)\)/);
  assert.ok(route.indexOf("verifyTurnstileToken") < route.indexOf("handleApplicationSubmission(request"));
});
