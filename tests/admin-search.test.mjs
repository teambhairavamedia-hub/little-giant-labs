import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ADMIN_SEARCH_MAX_LENGTH, adminSearchFilter, normalizeAdminSearch } from "../lib/admin-search.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("search text is trimmed, tidied and limited in length", () => {
  assert.equal(normalizeAdminSearch(null), "");
  assert.equal(normalizeAdminSearch("   "), "");
  assert.equal(normalizeAdminSearch("  Acme   Corp \n"), "Acme Corp");
  assert.equal(normalizeAdminSearch("a\u0000b"), "a b");
  assert.equal(normalizeAdminSearch("x".repeat(ADMIN_SEARCH_MAX_LENGTH)), "x".repeat(ADMIN_SEARCH_MAX_LENGTH));
  assert.equal(normalizeAdminSearch("x".repeat(ADMIN_SEARCH_MAX_LENGTH + 1)), null);
});

test("search matches company name, email and contact name, ignoring case", () => {
  assert.equal(
    adminSearchFilter("acme"),
    'legal_name.ilike."%acme%",decision_maker_email.ilike."%acme%",contact_name.ilike."%acme%"',
  );
});

test("search text is matched literally and can't change the filter", () => {
  // LIKE wildcards are escaped, so "john_doe" doesn't match "johnXdoe" and "100%" means a percent sign
  assert.match(adminSearchFilter("john_doe"), /"%john\\\\_doe%"/);
  assert.match(adminSearchFilter("100%"), /"%100\\\\%%"/);
  // Commas, brackets and dots stay inside the quoted value
  const filter = adminSearchFilter("a,b).or(c");
  assert.equal(filter.split(",legal_name").length, 1);
  assert.equal((filter.match(/\.ilike\./g) ?? []).length, 3);
  // Quotes and backslashes are escaped inside the quoted value
  assert.match(adminSearchFilter('say "hi"\\'), /"%say \\"hi\\"\\\\\\\\%"/);
});

test("applications endpoint filters the list by the search and keeps metrics for every application", async () => {
  const route = await read("../app/api/admin/applications/route.ts");
  assert.match(route, /normalizeAdminSearch\(request\.nextUrl\.searchParams\.get\("q"\)\)/);
  assert.match(route, /Search must be \$\{ADMIN_SEARCH_MAX_LENGTH\} characters or fewer\./);
  assert.match(route, /listQuery\.or\(adminSearchFilter\(search\)\)/);
  assert.match(route, /pagination: \{ page, pageSize, total: matching, totalPages \}/);
  assert.match(route, /totalApplications: total/);
  // The search runs only after the session check
  assert.ok(route.indexOf("getAdminSession") < route.indexOf("adminSearchFilter(search)"));
});

test("dashboard offers a search box that searches all applications", async () => {
  const dashboard = await read("../components/admin/AdminDashboard.tsx");
  const table = await read("../components/admin-dashboard/ApplicationsTable.tsx");
  assert.match(table, /placeholder="Search by company, email or contact name"/);
  assert.match(table, /<label htmlFor="applications-search"[^>]*>\s*Search applications\s*<\/label>/);
  assert.match(table, /aria-label="Clear search"/);
  assert.match(table, /No applications match/);
  assert.match(dashboard, /query\.set\("q", searchRef\.current\)/);
  assert.match(dashboard, /if \(request !== requestRef\.current\) return;/);
});
