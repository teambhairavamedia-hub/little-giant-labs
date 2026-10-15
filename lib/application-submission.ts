import { ValidationError, validateApplication } from "./application-validation.ts";

const MAX_BODY_BYTES = 16_384;

function redactDiagnosticText(value: string, submittedValues: string[]): string {
  let safe = value;
  for (const submittedValue of submittedValues) {
    if (submittedValue.length < 3) continue;
    for (const variant of [submittedValue, encodeURIComponent(submittedValue)]) {
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      safe = safe.replace(new RegExp(escaped, "gi"), "[REDACTED]");
    }
  }
  return safe
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
    .replace(/https?:\/\/[^\s"'<>]+/gi, "[REDACTED_URL]")
    .replace(/\bBearer\s+[^\s"']+/gi, "Bearer [REDACTED]")
    .replace(/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[REDACTED_TOKEN]")
    .replace(/\bpostgres(?:ql)?:\/\/[^\s"']+/gi, "[REDACTED_DATABASE_URL]");
}

function diagnosticMetadata(error: unknown, submittedValues: string[]): Record<string, string> {
  if (!error || typeof error !== "object") {
    return { message: redactDiagnosticText(String(error), submittedValues) };
  }

  const source = error as Record<string, unknown>;
  const metadata: Record<string, string> = {};
  for (const field of ["name", "message", "code", "details", "hint", "stack"] as const) {
    const value = source[field];
    if (typeof value === "string" && value.length > 0) {
      metadata[field] = redactDiagnosticText(value, submittedValues);
    }
  }
  return metadata;
}

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
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(body);
}

export async function handleApplicationSubmission(
  request: Request,
  save: (application: ReturnType<typeof validateApplication>) => Promise<void>,
): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Unable to submit this application." }, { status: 403 });
  }
  const contentType = request.headers.get("content-type") ?? "";
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_BODY_BYTES) return Response.json({ error: "Submit a valid application request." }, { status: 413 });
  if (!contentType.toLowerCase().includes("application/json")) return Response.json({ error: "Submit a JSON application request." }, { status: 415 });

  let submittedValues: string[] = [];
  try {
    const rawBody = await readLimitedBody(request);
    if (rawBody === null) return Response.json({ error: "Submit a valid application request." }, { status: 413 });
    let body: unknown;
    try { body = JSON.parse(rawBody); } catch {
      return Response.json({ error: "Submit a valid application request." }, { status: 400 });
    }
    const application = validateApplication(body);
    submittedValues = Object.values(application).flatMap((value) => Array.isArray(value) ? value : [value]);
    await save(application);
    return Response.json({ success: true, message: "Your application has been submitted." }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) return Response.json({ error: error.message }, { status: 400 });
    console.error("Application submission failed", diagnosticMetadata(error, submittedValues));
    return Response.json({ error: "We couldn’t submit your application. Please try again later." }, { status: 500 });
  }
}
