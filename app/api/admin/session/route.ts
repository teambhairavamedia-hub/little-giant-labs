import { NextRequest, NextResponse } from "next/server";
import { firebaseAdminAuth } from "@/lib/firebase/admin";
import { ADMIN_SESSION_COOKIE, SESSION_DURATION_MS } from "@/lib/admin-session";
import { hasSameOrigin } from "@/lib/admin-request";
import { isAuthorizedAdminClaims } from "@/lib/admin-email-allowlist";

export const runtime = "nodejs";

function sanitizedErrorMessage(cause: unknown) {
  if (!(cause instanceof Error)) return "Unknown server error.";
  return cause.message
    .replace(/-----BEGIN[\s\S]*?-----END[^-]+-----/g, "[REDACTED CREDENTIAL]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[REDACTED TOKEN]")
    .replace(/\bAIza[0-9A-Za-z_-]{20,}\b/g, "[REDACTED KEY]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED EMAIL]")
    .replace(/(authorization|token|password|private[ _-]?key)\s*[:=]\s*[^\s,;]+/gi, "$1=[REDACTED]")
    .replace(/\s+/g, " ")
    .slice(0, 300);
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 8_192) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 8_192) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const idToken = (body as { idToken?: unknown }).idToken;
  if (idToken === undefined || idToken === "") {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }
  if (typeof idToken !== "string" || idToken.length > 8_000) {
    return NextResponse.json({ error: "Invalid sign-in token." }, { status: 400 });
  }
  let phase = "firebase_admin_initialization";
  try {
    const auth = firebaseAdminAuth();
    phase = "id_token_verification";
    const decoded = await auth.verifyIdToken(idToken, true);
    phase = "admin_authorization";
    if (!isAuthorizedAdminClaims(decoded, process.env.ADMIN_EMAILS)) {
      return NextResponse.json({ error: "This account is not authorized for the admin dashboard." }, { status: 403 });
    }
    phase = "session_cookie_creation";
    const session = await auth.createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(ADMIN_SESSION_COOKIE, session, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/", maxAge: SESSION_DURATION_MS / 1000,
    });
    return response;
  } catch (cause) {
    const rawCode = typeof cause === "object" && cause !== null && "code" in cause ? String(cause.code) : "";
    const code = /^[a-z0-9/_-]{1,100}$/i.test(rawCode) ? rawCode : "";
    if (["auth/argument-error", "auth/invalid-id-token", "auth/id-token-expired", "auth/id-token-revoked"].includes(code)) {
      return NextResponse.json({ error: "Sign-in could not be verified. Please sign in again." }, { status: 401 });
    }
    console.error("admin_session_creation_failed", {
      event: "admin_session_creation_failed",
      phase,
      code: code || null,
      message: sanitizedErrorMessage(cause),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Authentication service is temporarily unavailable." }, { status: 500 });
  }
}
