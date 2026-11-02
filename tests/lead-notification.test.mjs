import { test } from "node:test";
import assert from "node:assert/strict";
import { buildLeadEmail, getLeadNotificationConfig, sendLeadNotification } from "../lib/lead-notification.ts";

const application = () => ({
  contact_name: "Asha Rao",
  decision_maker_email: "ceo@example.com",
  legal_name: "Example Corporation",
  help_with: "Brand strategy & positioning",
  project_details: "We are launching a new product line.\n<script>alert(1)</script>",
  contact_role: null,
  timeline: "Within 1–3 months",
  contact_phone: "+919876543210",
  qualification_status: "pending_review",
});
const config = { apiKey: "re_test", to: ["team@example.com", "sales@example.com"], from: "Website <leads@example.com>" };
const adminUrl = "https://example.com/admin";

test("config is skipped unless the key, sender and recipients are all set", () => {
  assert.equal(getLeadNotificationConfig({}), null);
  assert.equal(getLeadNotificationConfig({ RESEND_API_KEY: "k", LEAD_NOTIFICATION_FROM: "a@b.c", LEAD_NOTIFICATION_TO: " , " }), null);
  assert.deepEqual(
    getLeadNotificationConfig({ RESEND_API_KEY: " k ", LEAD_NOTIFICATION_FROM: "a@b.c", LEAD_NOTIFICATION_TO: "x@y.z, w@y.z" }),
    { apiKey: "k", from: "a@b.c", to: ["x@y.z", "w@y.z"] },
  );
});

test("email lists the enquiry in plain text, with a one-line subject", () => {
  const input = application();
  input.legal_name = "Evil\r\nBcc: victim@example.com";
  const { subject, text } = buildLeadEmail(input, adminUrl);
  assert.equal(subject, "New enquiry: Evil Bcc: victim@example.com (Brand strategy & positioning)");
  assert.doesNotMatch(subject, /[\r\n]/);
  assert.match(text, /Name: Asha Rao/);
  assert.match(text, /Role: Not given/);
  assert.match(text, /Phone \/ WhatsApp: \+919876543210/);
  assert.match(text, /Timeline: Within 1–3 months/);
  assert.match(text, /<script>alert\(1\)<\/script>/); // kept as literal text; the email has no HTML part
  assert.match(text, /All enquiries: https:\/\/example.com\/admin/);
});

test("sends to Resend with reply-to set to the enquirer", async () => {
  let request;
  const fetchImpl = async (url, init) => { request = { url, init }; return new Response("{}", { status: 200 }); };
  assert.equal(await sendLeadNotification(application(), adminUrl, config, fetchImpl), "sent");
  assert.equal(request.url, "https://api.resend.com/emails");
  assert.equal(request.init.headers.Authorization, "Bearer re_test");
  const body = JSON.parse(request.init.body);
  assert.deepEqual(body.to, config.to);
  assert.equal(body.reply_to, "ceo@example.com");
  assert.equal(body.html, undefined);
});

test("does nothing without config, and reports failures without throwing or logging personal data", async () => {
  let called = false;
  assert.equal(await sendLeadNotification(application(), adminUrl, null, async () => { called = true; return new Response(); }), "skipped");
  assert.equal(called, false);

  const logged = [];
  const original = console.error;
  console.error = (...args) => logged.push(JSON.stringify(args));
  try {
    assert.equal(await sendLeadNotification(application(), adminUrl, config, async () => new Response("no", { status: 422 })), "failed");
    assert.equal(await sendLeadNotification(application(), adminUrl, config, async () => { throw new TypeError("network"); }), "failed");
  } finally {
    console.error = original;
  }
  assert.equal(logged.length, 2);
  for (const line of logged) assert.doesNotMatch(line, /example\.com|Asha|Example Corporation/);
});
