import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("session endpoint verifies ID token with revocation check before issuing cookie", async () => {
  const route = await read("../app/api/admin/session/route.ts");
  assert.match(route, /verifyIdToken\([^,]+,\s*true\)/);
  assert.match(route, /decoded\.email_verified !== true/);
  assert.ok(route.indexOf("verifyIdToken") < route.indexOf("createSessionCookie"));
  assert.match(route, /httpOnly:\s*true/);
  assert.match(route, /sameSite:\s*"strict"/);
  assert.match(route, /secure:\s*process\.env\.NODE_ENV === "production"/);
  assert.match(route, /hasSameOrigin\(request\)/);
  assert.match(route, /idToken === undefined \|\| idToken === ""/);
  assert.match(route, /Authentication is required\./);
  assert.match(route, /status: 401/);
  assert.match(route, /status: 500/);
});

test("protected session checks revocation and verified email", async () => {
  const session = await read("../lib/admin-session.ts");
  assert.match(session, /verifySessionCookie\(token,\s*true\)/);
  assert.match(session, /claims\.email_verified !== true/);
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

test("administrator authorization has no email allowlist dependency", async () => {
  const files = [
    "../app/api/admin/session/route.ts", "../lib/admin-session.ts", "../lib/firebase/admin.ts",
    "../components/admin/AdminLoginForm.tsx", "../README.md",
  ];
  const forbiddenSetting = ["ADMIN", "EMAILS"].join("_");
  for (const file of files) assert.equal((await read(file)).includes(forbiddenSetting), false);
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
