import { test } from "node:test";
import assert from "node:assert/strict";
import { describeLeadSource, normalizeLeadSource } from "../lib/lead-source.ts";
import { validateApplication } from "../lib/application-validation.ts";
import { buildLeadEmail } from "../lib/lead-notification.ts";

process.env.EMAIL_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 0x41).toString("base64");
const validInput = () => ({
  contact_name: "Asha Rao",
  decision_maker_email: "ceo@example.com",
  legal_name: "Example Corporation",
  help_with: "Brand strategy & positioning",
  project_details: "We are launching a new product line.",
});

test("lead source keeps only known, non-empty string fields within limits", () => {
  assert.deepEqual(
    normalizeLeadSource({ utm_source: " linkedin ", utm_medium: "social", evil: "x", gclid: 42, utm_term: "  ", landing_page: "/services" }),
    { utm_source: "linkedin", utm_medium: "social", landing_page: "/services" },
  );
  assert.equal(normalizeLeadSource({ utm_campaign: "a\r\nb" }).utm_campaign, "a b");
  assert.equal(normalizeLeadSource({ utm_source: "x".repeat(500) }).utm_source.length, 100);
  for (const empty of [null, undefined, "linkedin", [], {}, { utm_source: "" }, { other: "x" }]) {
    assert.equal(normalizeLeadSource(empty), null, JSON.stringify(empty));
  }
});

test("lead source is described for the dashboard and the alert email", () => {
  assert.equal(describeLeadSource(null), "Direct");
  assert.equal(describeLeadSource({ utm_source: "linkedin", utm_medium: "social" }), "linkedin / social");
  assert.equal(describeLeadSource({ utm_source: "newsletter" }), "newsletter");
  assert.equal(describeLeadSource({ gclid: "abc" }), "Google Ads");
  assert.equal(describeLeadSource({ fbclid: "abc" }), "Facebook / Instagram");
  assert.equal(describeLeadSource({ referrer: "https://www.google.com/" }), "google.com");
  assert.equal(describeLeadSource({ landing_page: "/" }), "Direct");
});

test("an enquiry stores its normalized source and never fails because of it", async () => {
  assert.equal((await validateApplication(validInput())).lead_source, null);
  assert.equal((await validateApplication({ ...validInput(), lead_source: "garbage" })).lead_source, null);
  const result = await validateApplication({ ...validInput(), lead_source: { utm_source: "meta", utm_campaign: "launch", unknown: "x" } });
  assert.deepEqual(result.lead_source, { utm_source: "meta", utm_campaign: "launch" });
  const { text } = buildLeadEmail(result, "https://example.com/admin");
  assert.match(text, /Came from: meta \(campaign: launch\)/);
  assert.match(buildLeadEmail({ ...result, lead_source: null }, "https://example.com/admin").text, /Came from: Direct/);
});

test("analytics IDs are validated before they reach the page", async () => {
  const { gaMeasurementId, metaPixelId } = await import("../lib/analytics.ts");
  const saved = { ga: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, px: process.env.NEXT_PUBLIC_META_PIXEL_ID };
  try {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID; delete process.env.NEXT_PUBLIC_META_PIXEL_ID;
    assert.equal(gaMeasurementId(), "G-8QYEK1Z4C8"); assert.equal(metaPixelId(), null);
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = " G-ABC123XYZ "; process.env.NEXT_PUBLIC_META_PIXEL_ID = "123456789012345";
    assert.equal(gaMeasurementId(), "G-ABC123XYZ"); assert.equal(metaPixelId(), "123456789012345");
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-1");alert(1)//'; process.env.NEXT_PUBLIC_META_PIXEL_ID = "12a";
    assert.equal(gaMeasurementId(), null); assert.equal(metaPixelId(), null);
  } finally {
    for (const [key, value] of [["NEXT_PUBLIC_GA_MEASUREMENT_ID", saved.ga], ["NEXT_PUBLIC_META_PIXEL_ID", saved.px]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test("enquiry analytics is a safe no-op without a browser", async () => {
  const { trackEnquiryEvent } = await import("../lib/analytics.ts");
  assert.doesNotThrow(() => trackEnquiryEvent("enquiry_form_start"));
  assert.doesNotThrow(() => trackEnquiryEvent("enquiry_step_complete", { step_number: 1, step_name: "about_you" }));
});
