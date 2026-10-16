import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { isAuthorizedAdminClaims } from "../lib/admin-email-allowlist.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("session endpoint verifies ID token and authorizes allowlisted claims before issuing cookie", async () => {
  const route = await read("../app/api/admin/session/route.ts");
  assert.match(route, /verifyIdToken\([^,]+,\s*true\)/);
  assert.match(route, /isAuthorizedAdminClaims\(decoded, process\.env\.ADMIN_EMAILS\)/);
  assert.ok(route.indexOf("verifyIdToken") < route.indexOf("createSessionCookie"));
  assert.ok(route.indexOf("isAuthorizedAdminClaims") < route.indexOf("createSessionCookie"));
  assert.match(route, /status: 403/);
  assert.match(route, /httpOnly:\s*true/);
  assert.match(route, /sameSite:\s*"strict"/);
  assert.match(route, /secure:\s*process\.env\.NODE_ENV === "production"/);
  assert.match(route, /hasSameOrigin\(request\)/);
  assert.match(route, /idToken === undefined \|\| idToken === ""/);
  assert.match(route, /Authentication is required\./);
  assert.match(route, /status: 401/);
  assert.match(route, /status: 500/);
});

test("unexpected session failures log phase-specific sanitized diagnostics", async () => {
  const route = await read("../app/api/admin/session/route.ts");
  for (const phase of [
    "firebase_admin_initialization", "id_token_verification",
    "admin_authorization", "session_cookie_creation",
  ]) assert.match(route, new RegExp(`(?:let )?phase = "${phase}"`));
  assert.match(route, /event: "admin_session_creation_failed"/);
  assert.match(route, /phase,\s*code: code \|\| null/);
  assert.match(route, /message: sanitizedErrorMessage\(cause\)/);
  assert.match(route, /timestamp: new Date\(\)\.toISOString\(\)/);
  assert.match(route, /REDACTED TOKEN/);
  assert.match(route, /REDACTED CREDENTIAL/);
  assert.match(route, /Authentication service is temporarily unavailable\./);
});

test("protected session checks revocation and verified email", async () => {
  const session = await read("../lib/admin-session.ts");
  assert.match(session, /verifySessionCookie\(token,\s*true\)/);
  assert.match(session, /isAuthorizedAdminClaims\(claims, process\.env\.ADMIN_EMAILS\)/);
});

test("verified users whose email is allowlisted can create an admin session", async () => {
  assert.equal(isAuthorizedAdminClaims(
    { email: "admin@example.com", email_verified: true },
    "admin@example.com",
  ), true);
});

test("verified Firebase users outside the allowlist are denied", async () => {
  assert.equal(isAuthorizedAdminClaims(
    { email: "other@example.com", email_verified: true },
    "admin@example.com",
  ), false);
});

test("unverified and missing-email claims are denied", async () => {
  assert.equal(isAuthorizedAdminClaims(
    { email: "admin@example.com", email_verified: false },
    "admin@example.com",
  ), false);
  assert.equal(isAuthorizedAdminClaims(
    { email_verified: true },
    "admin@example.com",
  ), false);
});

test("missing, empty, and comma-empty allowlists fail closed", async () => {
  const claims = { email: "admin@example.com", email_verified: true };
  for (const configuredEmails of [undefined, "", "  ", ", ,"]) {
    assert.equal(isAuthorizedAdminClaims(claims, configuredEmails), false);
  }
});

test("allowlist matching trims whitespace and ignores case", async () => {
  assert.equal(isAuthorizedAdminClaims(
    { email: " Admin@Example.COM ", email_verified: true },
    " first@example.com , admin@example.com ",
  ), true);
});

test("removing an email from the current allowlist rejects an existing session claim", async () => {
  const existingSessionClaims = { email: "admin@example.com", email_verified: true };
  assert.equal(isAuthorizedAdminClaims(existingSessionClaims, "admin@example.com"), true);
  assert.equal(isAuthorizedAdminClaims(existingSessionClaims, "second@example.com"), false);
  const session = await read("../lib/admin-session.ts");
  assert.match(session, /process\.env\.ADMIN_EMAILS/);
  assert.match(session, /verifySessionCookie\(token,\s*true\)/);
});

test("invalid or revoked Firebase tokens continue to be rejected", async () => {
  const route = await read("../app/api/admin/session/route.ts");
  const session = await read("../lib/admin-session.ts");
  assert.match(route, /verifyIdToken\(idToken, true\)/);
  assert.match(route, /auth\/invalid-id-token/);
  assert.match(route, /auth\/id-token-revoked/);
  assert.match(session, /verifySessionCookie\(token, true\)/);
});

test("unauthorized session requests return before any session cookie is set", async () => {
  const route = await read("../app/api/admin/session/route.ts");
  const denied = route.indexOf("if (!isAuthorizedAdminClaims");
  const created = route.indexOf("createSessionCookie");
  const cookie = route.indexOf("response.cookies.set");
  assert.ok(denied >= 0 && denied < created);
  assert.ok(created < cookie);
  assert.match(route.slice(denied, created), /status: 403/);
});

test("logout continues to revoke refresh tokens when possible and always clears cookie", async () => {
  const logout = await read("../app/api/admin/logout/route.ts");
  assert.match(logout, /hasSameOrigin\(request\)/);
  assert.match(logout, /verifySessionCookie\(token\)/);
  assert.match(logout, /revokeRefreshTokens\(claims\.uid\)/);
  assert.match(logout, /response\.cookies\.set\(ADMIN_SESSION_COOKIE, ""/);
});

test("unverified login offers client-side resend without session exchange", async () => {
  const form = await read("../components/admin/AdminLoginForm.tsx");
  assert.match(form, /await credential\.user\.reload\(\)/);
  assert.match(form, /if \(!credential\.user\.emailVerified\)/);
  assert.match(form, /sendEmailVerification\(verificationUser,\s*actionCodeSettings\)/);
  assert.match(form, /url: `\$\{window\.location\.origin\}\/admin\/login`/);
  assert.match(form, /Send verification mail/);
  assert.match(form, /Resend verification mail/);
  assert.match(form, /setVerificationEmailSent\(true\)/);
  assert.match(form, /disabled=\{sending \|\| !canResend\}/);
  assert.match(form, /too-many-requests/);
  assert.match(form, /await verificationUser\.reload\(\)/);
  assert.ok(form.indexOf("if (!credential.user.emailVerified)") < form.indexOf("fetch(\"/api/admin/session\""));
});

test("successful session creation navigates before best-effort Firebase client sign-out", async () => {
  const form = await read("../components/admin/AdminLoginForm.tsx");
  const acceptedResponse = form.indexOf("if (!response.ok) throw new Error");
  const navigation = form.indexOf('router.replace("/admin/dashboard")');
  const clientSignOut = form.indexOf("void signOut(auth).catch");
  assert.ok(acceptedResponse < navigation);
  assert.ok(navigation < clientSignOut);
  assert.match(form, /router\.refresh\(\)/);
  assert.match(form, /void signOut\(auth\)\.catch/);
});

test("verification handler applies the action code before setting the one-time login notice", async () => {
  const handler = await read("../app/admin/verify-email/page.tsx");
  const form = await read("../components/admin/AdminLoginForm.tsx");
  assert.match(handler, /mode !== "verifyEmail" \|\| !code/);
  assert.match(handler, /await applyActionCode\(auth, code\)/);
  assert.ok(handler.indexOf("await applyActionCode") < handler.indexOf("sessionStorage.setItem"));
  assert.match(handler, /admin\/login\?verified=1/);
  assert.match(handler, /already been used/);
  assert.match(handler, /has expired/);
  assert.match(form, /sessionStorage\.getItem\("admin-email-verified"\)/);
  assert.match(form, /Your email has been verified\. Sign in now\./);
});

test("ADMIN_EMAILS is documented as a server-side fail-closed setting", async () => {
  const example = await read("../.env.example");
  const readme = await read("../README.md");
  const authorization = await read("../lib/admin-email-allowlist.ts");
  assert.match(example, /^ADMIN_EMAILS=admin@example\.com,second-admin@example\.com$/m);
  assert.match(readme, /ADMIN_EMAILS/);
  assert.match(readme, /fails closed/);
  assert.match(readme, /redeploy/);
  assert.match(readme, /does not create a Firebase account/);
  assert.doesNotMatch(authorization, /process\.env/);
});

test("application submission remains public and admin APIs do not expose application data", async () => {
  const applications = await read("../app/api/applications/route.ts");
  const session = await read("../app/api/admin/session/route.ts");
  const logout = await read("../app/api/admin/logout/route.ts");
  assert.match(applications, /handleApplicationSubmission/);
  assert.doesNotMatch(applications, /getAdminSession|verifySessionCookie/);
  assert.match(session, /verifyIdToken/);
  assert.match(logout, /verifySessionCookie/);
});
