import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { ValidatedApplication } from "./application-validation.ts";

const VERIFICATION_LIFETIME_MS = 24 * 60 * 60 * 1000;

export type InitialVerificationJobMetadata = {
  tokenHashBytea: string;
  encryptedTokenPayloadBytea: string;
  tokenExpiresAt: string;
  idempotencyKey: string;
  requestFingerprintBytea: string;
};

type RandomBytes = (size: number) => Buffer;
type Clock = () => number;

/**
 * Creates the initial verification metadata for one API submission attempt.
 * The plaintext token exists only in this function's local scope; only its
 * SHA-256 digest and a PostgreSQL bytea hex string leave this function.
 */
export function createInitialVerificationJobMetadata(
  getRandomBytes: RandomBytes = randomBytes,
  now: Clock = Date.now,
  keyValue: string | undefined = process.env.EMAIL_TOKEN_ENCRYPTION_KEY,
  idempotencyKey?: string,
  requestFingerprintBytea = "",
): InitialVerificationJobMetadata {
  const token = getRandomBytes(32).toString("base64url");
  const tokenCreatedAt = now();
  const tokenHash = createHash("sha256").update(token, "utf8").digest();
  const key = decodeEncryptionKey(keyValue);
  const nonce = getRandomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, nonce);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const payload = Buffer.concat([Buffer.from([1]), nonce, cipher.getAuthTag(), encrypted]);

  return {
    tokenHashBytea: `\\x${tokenHash.toString("hex")}`,
    encryptedTokenPayloadBytea: `\\x${payload.toString("hex")}`,
    tokenExpiresAt: new Date(tokenCreatedAt + VERIFICATION_LIFETIME_MS).toISOString(),
    idempotencyKey: idempotencyKey ?? `application-submission:${getRandomBytes(32).toString("hex")}`,
    requestFingerprintBytea,
  };
}

function decodeEncryptionKey(value: string | undefined): Buffer {
  if (!value || !/^(?:[A-Za-z0-9+/]{4}){10}[A-Za-z0-9+/]{3}=+$/.test(value)) {
    throw new Error("EMAIL_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  }
  const key = Buffer.from(value, "base64");
  if (key.length !== 32 || key.toString("base64") !== value) {
    throw new Error("EMAIL_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  }
  return key;
}

export function decryptVerificationToken(payloadBytea: string, keyValue = process.env.EMAIL_TOKEN_ENCRYPTION_KEY): string {
  const key = decodeEncryptionKey(keyValue);
  if (!/^\\x(?:[0-9a-f]{2})+$/i.test(payloadBytea)) throw new Error("Malformed encrypted token payload.");
  const payload = Buffer.from(payloadBytea.slice(2), "hex");
  if (payload.length < 30 || payload[0] !== 1) throw new Error("Malformed encrypted token payload.");
  const decipher = createDecipheriv("aes-256-gcm", key, payload.subarray(1, 13));
  decipher.setAuthTag(payload.subarray(13, 29));
  return Buffer.concat([decipher.update(payload.subarray(29)), decipher.final()]).toString("utf8");
}

export function fingerprintApplication(application: ValidatedApplication): string {
  const canonical = [application.legal_name, application.industry_vertical, application.ttm_revenue,
    application.monthly_ad_spend, application.growth_bottleneck, application.partnership_readiness,
    application.decision_maker_email, application.decision_maker_linkedin];
  return `\\x${createHash("sha256").update(JSON.stringify(canonical), "utf8").digest("hex")}`;
}

export function buildCreateApplicationWithEmailJobArgs(
  application: ValidatedApplication,
  metadata: InitialVerificationJobMetadata,
) {
  return {
    p_legal_name: application.legal_name,
    p_industry_vertical: application.industry_vertical,
    p_ttm_revenue: application.ttm_revenue,
    p_monthly_ad_spend: application.monthly_ad_spend,
    p_growth_bottleneck: application.growth_bottleneck,
    p_partnership_readiness: application.partnership_readiness,
    p_decision_maker_email: application.decision_maker_email,
    p_decision_maker_linkedin: application.decision_maker_linkedin,
    p_token_hash: metadata.tokenHashBytea,
    p_token_expires_at: metadata.tokenExpiresAt,
    p_encrypted_token_payload: metadata.encryptedTokenPayloadBytea,
    p_idempotency_key: metadata.idempotencyKey,
    p_request_fingerprint: metadata.requestFingerprintBytea,
  };
}

export function getVerificationMetadataForRedaction(metadata: InitialVerificationJobMetadata): string[] {
  return [metadata.tokenHashBytea, metadata.tokenHashBytea.slice(2), metadata.encryptedTokenPayloadBytea, metadata.idempotencyKey, metadata.requestFingerprintBytea];
}
