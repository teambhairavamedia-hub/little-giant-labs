import { checkEmailEligibility } from "../../../../lib/email-domain-eligibility.ts";
import { EmailDatasetInitializationError, EMAIL_ELIGIBILITY_MESSAGES, isEmailFormatValid } from "../../../../lib/email-eligibility.ts";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 1_024;

async function readLimitedBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return Response.json({ error: "Submit a JSON email check." }, { status: 415 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return Response.json({ error: "Invalid email check." }, { status: 413 });

  let email: unknown;
  try {
    const rawBody = await readLimitedBody(request);
    if (rawBody === null) return Response.json({ error: "Invalid email check." }, { status: 413 });
    const body: unknown = JSON.parse(rawBody);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ error: "Invalid email check." }, { status: 400 });
    }
    email = (body as { email?: unknown }).email;
  } catch {
    return Response.json({ error: "Invalid email check." }, { status: 400 });
  }

  if (typeof email !== "string" || email.trim().length > 254 || !isEmailFormatValid(email)) {
    return Response.json({ outcome: "invalid" }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const outcome = await checkEmailEligibility(email.trim().toLowerCase());
    return Response.json({
      outcome,
      message: outcome === "disposable" || outcome === "free" ? EMAIL_ELIGIBILITY_MESSAGES[outcome] : undefined,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof EmailDatasetInitializationError) {
      return Response.json({ error: "Email eligibility is temporarily unavailable." }, { status: 503 });
    }
    return Response.json({ error: "Email eligibility is temporarily unavailable." }, { status: 503 });
  }
}
