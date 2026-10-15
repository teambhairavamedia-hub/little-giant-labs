import { test } from "node:test";
import assert from "node:assert/strict";
import { validateApplication, ValidationError } from "../lib/application-validation.ts";
import { handleApplicationSubmission } from "../lib/application-submission.ts";

const validInput = () => ({
  legal_name: "Example Corporation",
  industry_vertical: "Enterprise Banking & FinTech",
  ttm_revenue: "$1M – $5 Million",
  monthly_ad_spend: "$10,000 – $50,000 / month",
  growth_bottleneck: "Ad platform algorithmic fatigue & dropping ROAS",
  partnership_readiness: "We are prepared to invest premium capital for institutional scale and long-term partnership",
  decision_maker_email: "  CEO@Example.com ",
  decision_maker_linkedin: "https://www.linkedin.com/in/example-ceo",
});

test("valid application is qualified and normalized", () => {
  const result = validateApplication(validInput());
  assert.equal(result.qualification_status, "qualified");
  assert.deepEqual(result.rejection_reasons, []);
  assert.equal(result.decision_maker_email, "ceo@example.com");
});

test("each disqualifying answer receives its tag and submissions remain valid", () => {
  const cases = [
    ["ttm_revenue", "Under $1 Million", "ttm_revenue_below_1m"],
    ["monthly_ad_spend", "Under $10,000 / month", "monthly_ad_spend_below_10k"],
    ["partnership_readiness", "We are looking for a cheap, hands-off execution vendor", "cheap_execution_vendor"],
  ];
  for (const [key, value, reason] of cases) {
    const result = validateApplication({ ...validInput(), [key]: value });
    assert.equal(result.qualification_status, "rejected");
    assert.deepEqual(result.rejection_reasons, [reason]);
  }
});

test("multiple rejection reasons are all retained", () => {
  const result = validateApplication({ ...validInput(), ttm_revenue: "Under $1 Million", monthly_ad_spend: "Under $10,000 / month", partnership_readiness: "We are looking for a cheap, hands-off execution vendor" });
  assert.equal(result.qualification_status, "rejected");
  assert.deepEqual(result.rejection_reasons, ["ttm_revenue_below_1m", "monthly_ad_spend_below_10k", "cheap_execution_vendor"]);
});

test("invalid enumerations and missing required fields are rejected", () => {
  assert.throws(() => validateApplication({ ...validInput(), industry_vertical: "Other" }), ValidationError);
  const missing = validInput();
  delete missing.legal_name;
  assert.throws(() => validateApplication(missing), ValidationError);
});

test("consumer email providers, including subdomains, are rejected", () => {
  for (const email of ["a@gmail.com", "a.mail.yahoo.com", "a@yahoo.co.uk", "a@outlook.com"]) {
    assert.throws(() => validateApplication({ ...validInput(), decision_maker_email: email }), ValidationError);
  }
});

test("malformed or non-profile LinkedIn URLs are rejected", () => {
  for (const linkedin of ["not a url", "http://linkedin.com/in/a", "https://linkedin.com/company/acme", "https://linkedin.com.evil.test/in/a"]) {
    assert.throws(() => validateApplication({ ...validInput(), decision_maker_linkedin: linkedin }), ValidationError);
  }
});

test("browser-supplied qualification fields cannot override server calculation", () => {
  const result = validateApplication({ ...validInput(), qualification_status: "rejected", rejection_reasons: ["fake"] });
  assert.equal(result.qualification_status, "qualified");
  assert.deepEqual(result.rejection_reasons, []);
});

test("successful endpoint responses follow a completed save, including rejected submissions", async () => {
  const saved = [];
  const response = await handleApplicationSubmission(new Request("https://site.test/api/applications", {
    method: "POST", headers: { "content-type": "application/json", origin: "https://site.test" },
    body: JSON.stringify({ ...validInput(), ttm_revenue: "Under $1 Million" }),
  }), async (application) => { saved.push(application); });
  assert.equal(response.status, 201);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].qualification_status, "rejected");
});

test("database failures return a safe server error", async () => {
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handleApplicationSubmission(new Request("https://site.test/api/applications", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(validInput()),
    }), async () => { throw new Error("private SQL details"); });
    assert.equal(response.status, 500);
    assert.doesNotMatch(await response.text(), /private SQL details/);
  } finally { console.error = originalError; }
});

test("database diagnostics preserve safe metadata and redact submitted values", async () => {
  const entries = [];
  const originalError = console.error;
  console.error = (...args) => entries.push(args);
  try {
    const response = await handleApplicationSubmission(new Request("https://site.test/api/applications", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(validInput()),
    }), async () => {
      throw {
        name: "PostgrestError",
        message: "Constraint failure for CEO@Example.com",
        code: "23514",
        details: "Rejected Example Corporation",
        hint: "Check the constraint",
        stack: "PostgrestError: Constraint failure for CEO@Example.com",
      };
    });
    assert.equal(response.status, 500);
    assert.doesNotMatch(await response.text(), /23514|PostgrestError|Example\.com/);
    const loggedMetadata = entries[0][1];
    assert.equal(loggedMetadata.name, "PostgrestError");
    assert.equal(loggedMetadata.code, "23514");
    assert.match(loggedMetadata.message, /\[REDACTED\]/);
    assert.doesNotMatch(JSON.stringify(loggedMetadata), /CEO@Example\.com|Example Corporation/);
  } finally { console.error = originalError; }
});
