import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { isTurnstileRequired, verifyTurnstileToken, TURNSTILE_ACTION } from "../lib/turnstile.ts";

// Placeholder values for the test only; Cloudflare is never contacted (fetch is replaced below)
const realFetch = globalThis.fetch;
const env = { site: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, secret: process.env.TURNSTILE_SECRET_KEY };
afterEach(() => {
  globalThis.fetch = realFetch;
  if (env.site === undefined) delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY; else process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = env.site;
  if (env.secret === undefined) delete process.env.TURNSTILE_SECRET_KEY; else process.env.TURNSTILE_SECRET_KEY = env.secret;
});
const replyWith = (body) => { globalThis.fetch = async () => new Response(JSON.stringify(body)); };

test("the robot check stays off until both keys are set", () => {
  delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;
  assert.equal(isTurnstileRequired(), false);
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
  assert.equal(isTurnstileRequired(), false);
  delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  process.env.TURNSTILE_SECRET_KEY = "test-secret";
  assert.equal(isTurnstileRequired(), false);
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
  assert.equal(isTurnstileRequired(), true);
});

test("a token passes only when Cloudflare confirms it for the enquiry form", async () => {
  process.env.TURNSTILE_SECRET_KEY = "test-secret";
  replyWith({ success: true, action: TURNSTILE_ACTION });
  assert.equal(await verifyTurnstileToken("token", "203.0.113.1"), true);
  replyWith({ success: true, action: "some-other-form" });
  assert.equal(await verifyTurnstileToken("token", null), false);
  replyWith({ success: false, "error-codes": ["invalid-input-response"] });
  assert.equal(await verifyTurnstileToken("token", null), false);
});

test("missing tokens, missing secrets and network failures are refused", async () => {
  process.env.TURNSTILE_SECRET_KEY = "test-secret";
  replyWith({ success: true, action: TURNSTILE_ACTION });
  assert.equal(await verifyTurnstileToken(null, null), false);
  assert.equal(await verifyTurnstileToken("x".repeat(2049), null), false);
  globalThis.fetch = async () => { throw new Error("offline"); };
  assert.equal(await verifyTurnstileToken("token", null), false);
  delete process.env.TURNSTILE_SECRET_KEY;
  replyWith({ success: true, action: TURNSTILE_ACTION });
  assert.equal(await verifyTurnstileToken("token", null), false);
});
