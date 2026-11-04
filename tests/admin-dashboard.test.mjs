import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { normalizeContactEmail, normalizeContactPhone, normalizeLinkedInProfileUrl } from "../lib/admin-contact-links.ts";

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
  assert.match(route, /id, legal_name, contact_name, help_with, qualification_status, submitted_at, decision_maker_email, contact_phone, lead_source/);
  assert.match(route, /\.order\("submitted_at", \{ ascending: false \}\)\.order\("id", \{ ascending: false \}\)/);
  assert.match(route, /PAGE_SIZE_DEFAULT = 25/);
  assert.match(route, /PAGE_SIZE_MAX = 100/);
  assert.match(route, /fail\("The requested page is out of range\.", 416\)/);
  assert.match(route, /Cache-Control.*no-store/);
  assert.match(route, /Application data is temporarily unavailable\./);
});

test("application detail endpoint protects and scopes a read to a validated application ID", async () => {
  const route = await read("../app/api/admin/applications/[id]/route.ts");
  assert.ok(route.indexOf("getAdminSession") < route.indexOf("createSupabaseServerClient"));
  assert.match(route, /if \(!\(await getAdminSession\(\)\)\) return fail\("Authentication is required\.", 401\)/);
  assert.match(route, /\^\[0-9a-f\]\{8\}/i);
  assert.match(route, /\.eq\("id", id\)/);
  assert.match(route, /\.maybeSingle\(\)/);
  assert.match(route, /Application not found\.", 404/);
  assert.match(route, /id, contact_name, contact_role, decision_maker_email, contact_phone, lead_source, legal_name, help_with, project_details, timeline, company_size, industry_vertical, budget_range/);
  // Legacy partnership-application answers stay readable for older rows
  assert.match(route, /ttm_revenue, monthly_ad_spend, growth_bottleneck, partnership_readiness, decision_maker_linkedin, qualification_status, rejection_reasons/);
  assert.match(route, /Cache-Control.*no-store/);
});

test("dashboard offers a keyboard accessible detail panel and renders every stored answer safely", async () => {
  const dashboard = await read("../components/admin/AdminDashboard.tsx");
  for (const label of ["Name", "Work email", "Company or brand name", "What they need help with", "About the project", "Your role", "Desired timeline"]) assert.ok(dashboard.includes(`label="${label}"`) || dashboard.includes(`>${label}</dt>`), label);
  assert.doesNotMatch(dashboard, /label="Company size"|label="Industry"|label="Budget range"/);
  for (const label of ["Earlier company size", "Earlier application industry", "Earlier budget range"]) assert.ok(dashboard.includes(label));
  for (const label of ["Earlier application answers", "Trailing twelve-month revenue", "Monthly paid acquisition spend", "Strategic bottleneck", "Expectations regarding the engagement", "Decision-maker LinkedIn profile"]) assert.ok(dashboard.includes(label), label);
  assert.match(dashboard, /hasLegacyAnswers &&/);
  assert.match(dashboard, /role="dialog" aria-modal="true"/);
  assert.match(dashboard, /event\.key === "Escape"/);
  assert.match(dashboard, /rejectionLabels\[code\] \?\?/);
  assert.match(dashboard, /window\.requestAnimationFrame\(\(\) => openerRef\.current\?\.focus\(\)\)/);
  assert.match(dashboard, /if \(event\.target === event\.currentTarget\) onClose\(\)/);
  assert.match(dashboard, /target="_blank" rel="noopener noreferrer">\{linkedin\}/);
  assert.match(dashboard, /mailto:\$\{email\.split\("@"\)\.map\(encodeURIComponent\)\.join\("@"\)\}/);
});

test("dashboard uses persisted qualification outcomes and server returned metrics", async () => {
  const route = await read("../app/api/admin/applications/route.ts");
  const dashboard = await read("../components/admin/AdminDashboard.tsx");
  assert.match(route, /eq\("qualification_status", "qualified"\)/);
  assert.match(route, /eq\("qualification_status", "rejected"\)/);
  assert.match(route, /eq\("qualification_status", "pending_review"\)/);
  assert.match(route, /SEVEN_DAYS_MS = 7 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(dashboard, /No applications have been received\./);
  assert.match(dashboard, /qualifiedPercent = breakdownTotal \? Math\.round/);
  assert.match(dashboard, /router\.replace\("\/admin\/login"\)/);
});

test("qualification chart colors match status labels and the table keeps contact links safe", async () => {
  const dashboard = await read("../components/admin/AdminDashboard.tsx");
  assert.match(dashboard, /conic-gradient\(#15803d 0% \$\{qualifiedPercent\}%, #b91c1c/);
  assert.match(dashboard, /label="Qualified"[^\n]*color="#15803d" labelClass="text-green-800"/);
  assert.match(dashboard, /label="Rejected"[^\n]*color="#b91c1c" labelClass="text-red-800"/);
  assert.match(dashboard, /label="Pending review"[^\n]*color="#0284c7" labelClass="text-sky-800"/);
  assert.match(dashboard, /target="_blank" rel="noopener noreferrer"/);
  assert.match(dashboard, /mailto:\$\{email\.split\("@"\)\.map\(encodeURIComponent\)\.join\("@"\)\}/);
  assert.match(dashboard, /min-w-\[1320px\]/);
  assert.match(dashboard, /overflow-x-auto/);
  assert.match(dashboard, /timeZone: "Asia\/Kolkata"/);
  assert.match(dashboard, /Submitted \(IST\)/);
});

test("contact values accept valid inputs and reject malformed or unsafe values", () => {
  assert.equal(normalizeLinkedInProfileUrl("https://www.linkedin.com/in/example-person"), "https://www.linkedin.com/in/example-person/");
  assert.equal(normalizeLinkedInProfileUrl("https://linkedin.com/in/example_person/"), "https://www.linkedin.com/in/example_person/");
  for (const unsafe of ["", "javascript:alert(1)", "http://linkedin.com/in/name", "https://linkedin.com.evil.test/in/name", "https://evil.test/in/name", "https://linkedin.com/company/name", "https://user@linkedin.com/in/name", "https://linkedin.com/in/name?next=evil", "https://linkedin.com/in/%2fadmin"]) {
    assert.equal(normalizeLinkedInProfileUrl(unsafe), null, unsafe);
  }

  assert.equal(normalizeContactEmail(" person+tag@example.co.uk "), "person+tag@example.co.uk");
  for (const invalid of ["", "not-an-email", "person@example", "person@@example.com", ".person@example.com", "per..son@example.com", "person@example.com\r\nBcc:x@example.com", `${"a".repeat(250)}@example.com`, null]) {
    assert.equal(normalizeContactEmail(invalid), null, String(invalid));
  }
});

test("phone numbers are linked only when they are valid E.164 numbers", () => {
  assert.equal(normalizeContactPhone(" +919876543210 "), "+919876543210");
  assert.equal(normalizeContactPhone("+14155552671"), "+14155552671");
  for (const invalid of [null, undefined, "", "9876543210", "+91 98765", "+0123456789", "javascript:alert(1)", "+91987654321x"]) {
    assert.equal(normalizeContactPhone(invalid), null, String(invalid));
  }
});

test("bulk status update endpoint enforces origin, authentication, and strict validation", async () => {
  const route = await read("../app/api/admin/applications/route.ts");
  assert.match(route, /export async function PATCH/);
  assert.match(route, /hasSameOrigin\(request\)/);
  assert.match(route, /Request origin could not be verified\.", 403/);
  assert.match(route, /if \(!\(await getAdminSession\(\)\)\) return fail\("Authentication is required\.", 401\)/);
  assert.match(route, /ALLOWED_STATUSES = \["pending_review", "qualified", "rejected"\]/);
  assert.match(route, /A valid status is required \('pending_review', 'qualified', or 'rejected'\)\./);
  assert.match(route, /UUID_REGEX = \/\^\[0-9a-f\]\{8\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{4\}-\[0-9a-f\]\{12\}\$\/i/);
  assert.match(route, /A non-empty list of up to 100 application IDs is required\./);
  assert.match(route, /\.update\(\{ qualification_status: status \}\)/);
  assert.match(route, /\.in\("id", validIds\)/);
  assert.match(route, /Application status could not be updated\./);
});

test("dashboard supports individual selection, select-all, bulk status updates, and confirmation", async () => {
  const dashboard = await read("../components/admin/AdminDashboard.tsx");
  const globalsCss = await read("../app/globals.css");
  assert.match(dashboard, /aria-label="Select all applications on this page"/);
  assert.match(dashboard, /aria-label=\{`Select \$\{application\.legal_name\}`\}/);
  assert.match(dashboard, /toggleSelectAll/);
  assert.match(dashboard, /toggleSelect\(application\.id\)/);
  assert.match(dashboard, /Clear selection/);
  assert.match(dashboard, /aria-label="Bulk actions"/);
  assert.match(dashboard, /Change status to…/);
  assert.match(dashboard, /<option value="pending_review">Pending review<\/option>/);
  assert.match(dashboard, /<option value="qualified">Qualified<\/option>/);
  assert.match(dashboard, /<option value="rejected">Rejected<\/option>/);
  assert.match(dashboard, /Confirm status change/);
  assert.match(dashboard, /method: "PATCH"/);
  assert.match(dashboard, /status: targetStatus/);
  // Checkbox styling: white bg with black border when unchecked, blue bg with white checkmark when checked
  assert.match(dashboard, /admin-checkbox[^\n]*border-black[^\n]*bg-white/);
  assert.match(dashboard, /checked:bg-blue-600/);
  assert.match(globalsCss, /\.admin-checkbox\s*\{[^}]*border:\s*1px solid #000000;/);
  assert.match(globalsCss, /\.admin-checkbox\s*\{[^}]*background-color:\s*#ffffff;/);
  assert.match(globalsCss, /\.admin-checkbox:checked\s*\{[^}]*background-color:\s*#2563eb;/);
  assert.match(globalsCss, /\.admin-checkbox:checked\s*\{[^}]*background-image:/);
});

test("drawer supports individual status management with confirmation and 'Don't ask again' persistence", async () => {
  const dashboard = await read("../components/admin/AdminDashboard.tsx");
  // Interactive status dropdown in detail drawer
  assert.match(dashboard, /id="detail-status-select"/);
  assert.match(dashboard, /handleStatusSelect\(e\.target\.value/);
  assert.match(dashboard, /executeStatusUpdate/);
  // Confirmation modal in detail drawer includes company name and from/to statuses
  assert.match(dashboard, /confirm-individual-status-title/);
  assert.match(dashboard, /Are you sure you want to change the status of/);
  assert.match(dashboard, /id="dont-ask-again-individual"/);
  assert.match(dashboard, /id="bulk-dont-ask-again"/);
  // Persistence via localStorage and toggle setting
  assert.match(dashboard, /lgl-admin-skip-status-confirm/);
  assert.match(dashboard, /Status confirmations:/);
});
