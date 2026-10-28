import { test } from "node:test";
import assert from "node:assert/strict";
import { validateApplication, ValidationError } from "../lib/application-validation.ts";
import { handleApplicationSubmission } from "../lib/application-submission.ts";
import { createEmailDomainEligibilityChecker } from "../lib/email-domain-eligibility.ts";
import { EmailDatasetInitializationError, EmailEligibilityError, EMAIL_ELIGIBILITY_MESSAGES } from "../lib/email-eligibility.ts";
import { POST as checkEmailRequest } from "../app/api/applications/email-eligibility/route.ts";
import { readFile } from "node:fs/promises";
import { APPLICATION_LIMITS, applicationOptions } from "../lib/application-options.ts";

const idempotencyHeaders = { "content-type": "application/json", "idempotency-key": `application-submission:${"ab".repeat(32)}` };
process.env.EMAIL_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 0x41).toString("base64");

const validInput = () => ({
  contact_name: "  Asha Rao ",
  decision_maker_email: "  CEO@Example.com ",
  legal_name: "Example Corporation",
  help_with: "Brand strategy & positioning",
  project_details: "  We are launching a new product line and need positioning. ",
});

test("valid enquiry is pending review, trimmed and normalized", async () => {
  const result = await validateApplication(validInput());
  assert.equal(result.qualification_status, "pending_review");
  assert.equal("rejection_reasons" in result, false);
  assert.equal(result.decision_maker_email, "ceo@example.com");
  assert.equal(result.contact_name, "Asha Rao");
  assert.equal(result.project_details, "We are launching a new product line and need positioning.");
});

test("company size, industry, budget and timeline are optional and stored as null when skipped", async () => {
  for (const blanks of [{}, { company_size: "", industry_vertical: "  ", budget_range: null, timeline: "" }]) {
    const result = await validateApplication({ ...validInput(), ...blanks });
    for (const field of ["company_size", "industry_vertical", "budget_range", "timeline"]) assert.equal(result[field], null, field);
  }
  const answered = await validateApplication({
    ...validInput(),
    company_size: "11–50 people", industry_vertical: " Technology & SaaS ", budget_range: "$5,000 – $15,000", timeline: "Within 1–3 months",
  });
  assert.equal(answered.company_size, "11–50 people");
  assert.equal(answered.industry_vertical, "Technology & SaaS");
  assert.equal(answered.budget_range, "$5,000 – $15,000");
  assert.equal(answered.timeline, "Within 1–3 months");
});

test("every listed option is accepted for each answer field", async () => {
  for (const [field, options] of Object.entries(applicationOptions)) {
    for (const option of options) {
      const result = await validateApplication({ ...validInput(), [field]: option });
      assert.equal(result[field], option);
    }
  }
});

test("text answers are trimmed and limited to the database lengths", async () => {
  for (const length of [200, 255]) {
    const result = await validateApplication({ ...validInput(), legal_name: ` ${"x".repeat(length)} ` });
    assert.equal(result.legal_name.length, length);
  }
  await assert.rejects(validateApplication({ ...validInput(), legal_name: "x".repeat(256) }), ValidationError);
  await assert.rejects(validateApplication({ ...validInput(), contact_name: "x".repeat(APPLICATION_LIMITS.contactName + 1) }), ValidationError);
  const longest = await validateApplication({ ...validInput(), project_details: "y".repeat(APPLICATION_LIMITS.projectDetails) });
  assert.equal(longest.project_details.length, APPLICATION_LIMITS.projectDetails);
  await assert.rejects(validateApplication({ ...validInput(), project_details: "y".repeat(APPLICATION_LIMITS.projectDetails + 1) }), ValidationError);
  assert.deepEqual(APPLICATION_LIMITS, { contactName: 120, companyName: 255, projectDetails: 2000 });
  const form = await readFile(new URL("../components/contact/ContactForm.tsx", import.meta.url), "utf8");
  assert.match(form, /maxLength=\{APPLICATION_LIMITS\.companyName\}/);
  assert.match(form, /maxLength=\{APPLICATION_LIMITS\.projectDetails\}/);
});

test("invalid answers and missing required fields are rejected", async () => {
  await assert.rejects(validateApplication({ ...validInput(), help_with: "Something else" }), ValidationError);
  await assert.rejects(validateApplication({ ...validInput(), industry_vertical: "Bogus" }), ValidationError);
  await assert.rejects(validateApplication({ ...validInput(), budget_range: 5000 }), ValidationError);
  for (const field of ["contact_name", "decision_maker_email", "legal_name", "help_with", "project_details"]) {
    const missing = validInput();
    delete missing[field];
    await assert.rejects(validateApplication(missing), ValidationError, field);
    await assert.rejects(validateApplication({ ...validInput(), [field]: "   " }), ValidationError, field);
  }
  await assert.rejects(validateApplication(null), ValidationError);
  await assert.rejects(validateApplication([]), ValidationError);
  await assert.rejects(validateApplication("application"), ValidationError);
});

test("free email providers, including subdomains, are rejected with the business-email message", async () => {
  for (const email of ["a@gmail.com", "a@mail.yahoo.com", "a@yahoo.co.uk", "a@outlook.com"]) {
    await assert.rejects(
      validateApplication({ ...validInput(), decision_maker_email: email }),
      (error) => error instanceof EmailEligibilityError && error.outcome === "free" && error.message === EMAIL_ELIGIBILITY_MESSAGES.free,
    );
  }
});

test("known disposable email is rejected with a distinct outcome", async () => {
  await assert.rejects(
    validateApplication({ ...validInput(), decision_maker_email: " person@mailinator.com " }),
    (error) => error instanceof EmailEligibilityError && error.outcome === "disposable" && error.message === EMAIL_ELIGIBILITY_MESSAGES.disposable,
  );
});

test("valid custom-domain email proceeds and is normalized", async () => {
  const result = await validateApplication({ ...validInput(), decision_maker_email: "  CEO@Example.org " });
  assert.equal(result.decision_maker_email, "ceo@example.org");
});

test("disposable detection takes precedence when both detectors match", async () => {
  const checker = createEmailDomainEligibilityChecker(async () => ({
    isDisposableEmail: () => true,
    isFreeEmail: () => true,
  }));
  assert.equal(await checker("person@example.org"), "disposable");
});

test("email syntax validation still rejects malformed addresses before checking providers", async () => {
  for (const email of ["not-an-email", "person@example", "person@@example.com", "person@example.com\nBcc:x@example.com"]) {
    await assert.rejects(
      validateApplication({ ...validInput(), decision_maker_email: email }),
      (error) => error instanceof ValidationError && !(error instanceof EmailEligibilityError),
    );
  }
});

test("client and endpoint use the same eligibility outcomes and user-facing messages", async () => {
  const source = await readFile(new URL("../components/contact/ContactForm.tsx", import.meta.url), "utf8");
  assert.match(source, /EMAIL_ELIGIBILITY_MESSAGES\.disposable/);
  assert.match(source, /EMAIL_ELIGIBILITY_MESSAGES\.free/);
  for (const [email, outcome, message] of [
    ["person@mailinator.com", "disposable", EMAIL_ELIGIBILITY_MESSAGES.disposable],
    ["person@gmail.com", "free", EMAIL_ELIGIBILITY_MESSAGES.free],
  ]) {
    const response = await checkEmailRequest(new Request("https://site.test/api/applications/email-eligibility", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }),
    }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { outcome, message });
  }
});

test("submission responses expose stable, distinct eligibility codes and exact user messages", async () => {
  for (const [outcome, code] of [["disposable", "DISPOSABLE_EMAIL"], ["free", "FREE_EMAIL_PROVIDER"]]) {
    const response = await handleApplicationSubmission(new Request("https://site.test/api/applications", {
      method: "POST", headers: idempotencyHeaders, body: JSON.stringify(validInput()),
    }), async () => {}, async () => { throw new EmailEligibilityError(outcome); });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: EMAIL_ELIGIBILITY_MESSAGES[outcome], code });
  }
});

test("dataset initialization failure is cached as failure and cannot permit submission", async () => {
  let loads = 0;
  const checker = createEmailDomainEligibilityChecker(async () => {
    loads += 1;
    throw new Error("private package loading detail");
  });
  await assert.rejects(checker("person@example.org"), EmailDatasetInitializationError);
  await assert.rejects(checker("person@example.org"), EmailDatasetInitializationError);
  assert.equal(loads, 1);

  let saved = false;
  const response = await handleApplicationSubmission(new Request("https://site.test/api/applications", {
    method: "POST", headers: idempotencyHeaders, body: JSON.stringify(validInput()),
  }), async () => { saved = true; }, async () => { throw new EmailDatasetInitializationError(); });
  assert.equal(response.status, 503);
  assert.equal(saved, false);
  assert.doesNotMatch(await response.text(), /private package loading detail/);
});

test("browser-supplied qualification fields cannot override pending review", async () => {
  const result = await validateApplication({ ...validInput(), qualification_status: "rejected", rejection_reasons: ["fake"] });
  assert.equal(result.qualification_status, "pending_review");
  assert.equal("rejection_reasons" in result, false);
});

test("successful endpoint saves the enquiry for administrator review with skipped answers as null", async () => {
  const saved = [];
  const response = await handleApplicationSubmission(new Request("https://site.test/api/applications", {
    method: "POST", headers: { ...idempotencyHeaders, origin: "https://site.test" },
    body: JSON.stringify({ ...validInput(), budget_range: "Not sure yet", timeline: "" }),
  }), async (application) => { saved.push(application); });
  assert.equal(response.status, 201);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].qualification_status, "pending_review");
  assert.equal(saved[0].budget_range, "Not sure yet");
  assert.equal(saved[0].timeline, null);
  assert.equal("rejection_reasons" in saved[0], false);
});

test("database failures return a safe server error", async () => {
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handleApplicationSubmission(new Request("https://site.test/api/applications", {
      method: "POST", headers: idempotencyHeaders, body: JSON.stringify(validInput()),
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
      method: "POST", headers: idempotencyHeaders, body: JSON.stringify(validInput()),
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
