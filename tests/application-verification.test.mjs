import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  buildCreateApplicationWithEmailJobArgs,
  createInitialVerificationJobMetadata,
  decryptVerificationToken,
} from "../lib/application-verification.ts";
import {
  handleApplicationSubmission,
  isIdempotencyConflict,
  SubmissionConflictError,
} from "../lib/application-submission.ts";

const validatedApplication = {
  legal_name: "Example Corporation",
  industry_vertical: "Enterprise Banking & FinTech",
  ttm_revenue: "$1M – $5 Million",
  monthly_ad_spend: "$10,000 – $50,000 / month",
  growth_bottleneck: "Ad platform algorithmic fatigue & dropping ROAS",
  partnership_readiness: "We are prepared to invest premium capital for institutional scale and long-term partnership",
  decision_maker_email: "ceo@example.org",
  decision_maker_linkedin: "https://www.linkedin.com/in/example-ceo",
  qualification_status: "pending_review",
};

const fixedMetadata = {
  tokenHashBytea: `\\x${"ab".repeat(32)}`,
  tokenExpiresAt: "2026-10-28T12:00:00.000Z",
  idempotencyKey: `application-submission:${"cd".repeat(32)}`,
  encryptedTokenPayloadBytea: `\\x01${"00".repeat(29)}`,
  requestFingerprintBytea: `\\x${"ef".repeat(32)}`,
};
const key = Buffer.alloc(32, 0x42).toString("base64");

test("verification token hash and idempotency key use cryptographically secure random bytes", () => {
  const source = (size) => Buffer.alloc(size, 0x11);
  const metadata = createInitialVerificationJobMetadata(source, () => Date.parse("2026-10-27T12:00:00.000Z"), key);
  const generatedToken = Buffer.alloc(32, 0x11).toString("base64url");
  const expectedHash = createHash("sha256").update(generatedToken, "utf8").digest("hex");

  assert.equal(metadata.tokenHashBytea, `\\x${expectedHash}`);
  assert.equal(metadata.idempotencyKey, `application-submission:${"11".repeat(32)}`);
  assert.doesNotMatch(JSON.stringify(metadata), new RegExp(generatedToken));
  assert.equal("token" in metadata, false);
  const rpcArgs = buildCreateApplicationWithEmailJobArgs(validatedApplication, metadata);
  assert.doesNotMatch(JSON.stringify(rpcArgs), new RegExp(generatedToken));
});

test("verification expiry is exactly 24 hours after token creation time", () => {
  const createdAt = Date.parse("2026-10-27T12:34:56.789Z");
  const metadata = createInitialVerificationJobMetadata((size) => Buffer.alloc(size, 0x22), () => createdAt, key);
  assert.equal(Date.parse(metadata.tokenExpiresAt) - createdAt, 24 * 60 * 60 * 1000);
});

test("RPC arguments map validated fields and serialize SHA-256 as PostgreSQL bytea hex", () => {
  const args = buildCreateApplicationWithEmailJobArgs(validatedApplication, fixedMetadata);
  assert.deepEqual(args, {
    p_legal_name: validatedApplication.legal_name,
    p_industry_vertical: validatedApplication.industry_vertical,
    p_ttm_revenue: validatedApplication.ttm_revenue,
    p_monthly_ad_spend: validatedApplication.monthly_ad_spend,
    p_growth_bottleneck: validatedApplication.growth_bottleneck,
    p_partnership_readiness: validatedApplication.partnership_readiness,
    p_decision_maker_email: validatedApplication.decision_maker_email,
    p_decision_maker_linkedin: validatedApplication.decision_maker_linkedin,
    p_token_hash: fixedMetadata.tokenHashBytea,
    p_token_expires_at: fixedMetadata.tokenExpiresAt,
    p_encrypted_token_payload: fixedMetadata.encryptedTokenPayloadBytea,
    p_idempotency_key: fixedMetadata.idempotencyKey,
    p_request_fingerprint: fixedMetadata.requestFingerprintBytea,
  });
  assert.match(args.p_token_hash, /^\\x[0-9a-f]{64}$/);
  assert.equal("qualification_status" in args, false);
  assert.match(args.p_encrypted_token_payload, /^\\x(?:[0-9a-f]{2})+$/i);
  assert.match(args.p_request_fingerprint, /^\\x[0-9a-f]{64}$/);
  assert.doesNotMatch(JSON.stringify(args), /plaintext-token/);
});

test("RPC failure returns a generic response and redacts generated values from diagnostics", async () => {
  const entries = [];
  const originalError = console.error;
  console.error = (...args) => entries.push(args);
  try {
    const response = await handleApplicationSubmission(
      new Request("https://site.test/api/applications", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": fixedMetadata.idempotencyKey },
        body: JSON.stringify({}),
      }),
      async () => {
        throw {
          name: "PostgrestError",
          message: `RPC constraint failure ${fixedMetadata.tokenHashBytea} ${fixedMetadata.idempotencyKey}`,
          code: "23505",
        };
      },
      async () => validatedApplication,
      () => fixedMetadata,
    );

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "We couldn’t submit your application. Please try again later." });
    assert.doesNotMatch(JSON.stringify(entries), /(?:ab){4}|(?:cd){4}/);
    assert.match(JSON.stringify(entries), /\[REDACTED\]/);
  } finally {
    console.error = originalError;
  }
});

test("submission route calls only the application-plus-job RPC, not a direct insert", async () => {
  const source = await readFile(new URL("../app/api/applications/route.ts", import.meta.url), "utf8");
  assert.match(source, /supabase\.rpc\(\s*"create_application_with_email_job"/);
  assert.doesNotMatch(source, /\.from\("growth_applications"\)\s*\.insert/);
});

test("AES-GCM encrypts recoverable tokens with unique nonces and rejects tampering or wrong keys", () => {
  const metadata1 = createInitialVerificationJobMetadata(undefined, () => 1, key);
  const metadata2 = createInitialVerificationJobMetadata(undefined, () => 1, key);
  const token = (size) => Buffer.alloc(size, 0x33);
  const deterministic = createInitialVerificationJobMetadata(token, () => 1, key);
  const decrypted = decryptVerificationToken(deterministic.encryptedTokenPayloadBytea, key);
  assert.equal(decrypted, Buffer.alloc(32, 0x33).toString("base64url"));
  assert.equal(createHash("sha256").update(decrypted).digest("hex"), deterministic.tokenHashBytea.slice(2));
  assert.notEqual(metadata1.encryptedTokenPayloadBytea.slice(4, 28), metadata2.encryptedTokenPayloadBytea.slice(4, 28));
  const tampered = `${deterministic.encryptedTokenPayloadBytea.slice(0, -2)}00`;
  assert.throws(() => decryptVerificationToken(tampered, key));
  assert.throws(() => decryptVerificationToken(deterministic.encryptedTokenPayloadBytea, Buffer.alloc(32, 0x43).toString("base64")));
  assert.throws(() => decryptVerificationToken("bad", key));
  assert.throws(() => createInitialVerificationJobMetadata(undefined, Date.now, undefined));
  assert.throws(() => createInitialVerificationJobMetadata(undefined, Date.now, "not-a-key"));
});

test("AES-GCM decryption rejects malformed lengths and unsupported versions before decrypting", () => {
  const metadata = createInitialVerificationJobMetadata(
    (size) => Buffer.alloc(size, 0x33),
    () => 1,
    key,
  );
  const payloadHex = metadata.encryptedTokenPayloadBytea.slice(2);

  assert.equal(payloadHex.length / 2, 72);
  assert.throws(() => decryptVerificationToken(`\\x${payloadHex.slice(0, -2)}`, key), /Malformed encrypted token payload/);
  assert.throws(() => decryptVerificationToken(`\\x${payloadHex}00`, key), /Malformed encrypted token payload/);
  assert.throws(() => decryptVerificationToken(`\\x02${payloadHex.slice(2)}`, key), /Malformed encrypted token payload/);
});

test("AES-GCM authentication failures from tampered data or an incorrect key are rejected", () => {
  const metadata = createInitialVerificationJobMetadata(
    (size) => Buffer.alloc(size, 0x44),
    () => 1,
    key,
  );
  const payloadHex = metadata.encryptedTokenPayloadBytea.slice(2);
  const tamperedCiphertext = `${payloadHex.slice(0, -2)}${payloadHex.endsWith("00") ? "01" : "00"}`;
  const tamperedTag = `${payloadHex.slice(0, 26)}${payloadHex.slice(26, 28) === "00" ? "01" : "00"}${payloadHex.slice(28)}`;

  assert.throws(() => decryptVerificationToken(`\\x${tamperedCiphertext}`, key));
  assert.throws(() => decryptVerificationToken(`\\x${tamperedTag}`, key));
  assert.throws(() => decryptVerificationToken(metadata.encryptedTokenPayloadBytea, Buffer.alloc(32, 0x45).toString("base64")));
});

test("submission rejects missing idempotency keys before creating a job", async () => {
  let saved = false;
  const response = await handleApplicationSubmission(
    new Request("https://site.test/api/applications", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({}),
    }),
    async () => { saved = true; },
  );
  assert.equal(response.status, 400);
  assert.equal(saved, false);
});

test("only the dedicated PostgreSQL SQLSTATE is treated as an idempotency conflict", async () => {
  assert.equal(isIdempotencyConflict({ code: "LGL01", message: "anything" }), true);
  assert.equal(isIdempotencyConflict({ code: "23505", message: "Idempotency key conflict" }), false);
  const response = await handleApplicationSubmission(
    new Request("https://site.test/api/applications", {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": fixedMetadata.idempotencyKey },
      body: JSON.stringify({}),
    }),
    async () => { throw new SubmissionConflictError(); },
    async () => validatedApplication,
    () => fixedMetadata,
  );
  assert.equal(response.status, 409);
  assert.doesNotMatch(await response.text(), /LGL01|database|Example Corporation/);
});

test("route maps only the dedicated SQLSTATE and keeps the established success response", async () => {
  const source = await readFile(new URL("../app/api/applications/route.ts", import.meta.url), "utf8");
  assert.match(source, /if \(isIdempotencyConflict\(error\)\)/);
  assert.doesNotMatch(source, /error\.message.*Idempotency key conflict/);
  const request = (key) => new Request("https://site.test/api/applications", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify({}),
  });
  const responses = [];
  const mockStore = new Map();
  let applicationCreates = 0;
  let jobCreates = 0;
  for (const key of [fixedMetadata.idempotencyKey, fixedMetadata.idempotencyKey]) {
    responses.push(await handleApplicationSubmission(request(key), async (_application, metadata) => {
      const previous = mockStore.get(metadata.idempotencyKey);
      if (previous && previous !== metadata.requestFingerprintBytea) throw new SubmissionConflictError();
      if (!previous) { applicationCreates += 1; jobCreates += 1; }
      mockStore.set(metadata.idempotencyKey, metadata.requestFingerprintBytea);
    }, async () => validatedApplication, (_random, _clock, _key, idempotencyKey, fingerprint) => ({
      ...fixedMetadata, idempotencyKey, requestFingerprintBytea: fingerprint,
    })));
  }
  const firstResult = await responses[0].json();
  const retryResult = await responses[1].json();
  assert.deepEqual(firstResult, retryResult);
  assert.deepEqual(firstResult, { success: true, message: "Your application has been submitted." });
  assert.equal(mockStore.size, 1);
  assert.equal(applicationCreates, 1);
  assert.equal(jobCreates, 1);

  const changedRequest = await handleApplicationSubmission(request(fixedMetadata.idempotencyKey), async (_application, metadata) => {
    const previous = mockStore.get(metadata.idempotencyKey);
    if (previous && previous !== metadata.requestFingerprintBytea) throw new SubmissionConflictError();
  }, async () => ({ ...validatedApplication, legal_name: "Different Corporation" }), (_random, _clock, _key, idempotencyKey, fingerprint) => ({
    ...fixedMetadata, idempotencyKey, requestFingerprintBytea: fingerprint,
  }));
  assert.equal(changedRequest.status, 409);
  assert.equal(mockStore.size, 1);

  const newKeyResponse = await handleApplicationSubmission(request(`application-submission:${"de".repeat(32)}`), async (_application, metadata) => {
    mockStore.set(metadata.idempotencyKey, metadata.requestFingerprintBytea);
    applicationCreates += 1;
    jobCreates += 1;
  }, async () => ({ ...validatedApplication, legal_name: "Another Corporation" }), (_random, _clock, _key, idempotencyKey, fingerprint) => ({
    ...fixedMetadata, idempotencyKey, requestFingerprintBytea: fingerprint,
  }));
  assert.equal(newKeyResponse.status, 201);
  assert.equal(mockStore.size, 2);
  assert.equal(applicationCreates, 2);
  assert.equal(jobCreates, 2);
});

test("contact form reuses its in-memory key on retries and clears it on edits and success", async () => {
  const source = await readFile(new URL("../components/contact/ContactForm.tsx", import.meta.url), "utf8");
  assert.match(source, /idempotencyKeyRef\.current \?\?/);
  assert.match(source, /"Idempotency-Key": idempotencyKey/);
  assert.match(source, /if \(values\[key\] !== value\) idempotencyKeyRef\.current = null/);
  assert.match(source, /idempotencyKeyRef\.current = null;\s*\} catch/s);
});
