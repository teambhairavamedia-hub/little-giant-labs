import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("admin entry and login use the canonical protected dashboard route", async () => {
  const entry = await read("../app/admin/page.tsx");
  const login = await read("../app/admin/login/page.tsx");
  const dashboard = await read("../app/admin/dashboard/page.tsx");
  assert.match(entry, /if \(!session\) redirect\("\/admin\/login"\)/);
  assert.match(entry, /redirect\("\/admin\/dashboard"\)/);
  assert.match(login, /if \(await getAdminSession\(\)\) redirect\("\/admin\/dashboard"\)/);
  assert.match(dashboard, /getAdminSession\(\)/);
  assert.match(dashboard, /redirect\("\/admin\/login"\)/);
});

test("applications endpoint protects access and selects only dashboard columns", async () => {
  const route = await read("../app/api/admin/applications/route.ts");
  assert.ok(route.indexOf("getAdminSession") < route.indexOf("createSupabaseServerClient"));
  assert.match(route, /if \(!\(await getAdminSession\(\)\)\) return fail\("Authentication is required\.", 401\)/);
  assert.match(route, /id, legal_name, industry_vertical, ttm_revenue, monthly_ad_spend, qualification_status, submitted_at/);
  assert.match(route, /\.order\("submitted_at", \{ ascending: false \}\)\.order\("id", \{ ascending: false \}\)/);
  assert.match(route, /PAGE_SIZE_DEFAULT = 25/);
  assert.match(route, /PAGE_SIZE_MAX = 100/);
  assert.match(route, /fail\("The requested page is out of range\.", 416\)/);
  assert.match(route, /Cache-Control.*no-store/);
  assert.match(route, /Application data is temporarily unavailable\./);
});

test("dashboard uses persisted qualification outcomes and server returned metrics", async () => {
  const route = await read("../app/api/admin/applications/route.ts");
  const dashboard = await read("../components/admin/AdminDashboard.tsx");
  assert.match(route, /eq\("qualification_status", "qualified"\)/);
  assert.match(route, /eq\("qualification_status", "rejected"\)/);
  assert.match(route, /SEVEN_DAYS_MS = 7 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(dashboard, /No applications have been received\./);
  assert.match(dashboard, /qualifiedPercent = breakdownTotal \? Math\.round/);
  assert.match(dashboard, /router\.replace\("\/admin\/login"\)/);
});
