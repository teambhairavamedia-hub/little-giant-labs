import { NextRequest, NextResponse } from "next/server";
import { firebaseAdminAuth } from "@/lib/firebase/admin";
import { ADMIN_SESSION_COOKIE, SESSION_DURATION_MS } from "@/lib/admin-session";
import { hasSameOrigin } from "@/lib/admin-request";

export const runtime = "nodejs";

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
  try {
    const decoded = await firebaseAdminAuth().verifyIdToken(idToken, true);
    if (decoded.email_verified !== true) {
      return NextResponse.json({ error: "This account is not authorized for the admin dashboard." }, { status: 403 });
    }
    const session = await firebaseAdminAuth().createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(ADMIN_SESSION_COOKIE, session, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/", maxAge: SESSION_DURATION_MS / 1000,
    });
    return response;
  } catch (cause) {
    const code = typeof cause === "object" && cause !== null && "code" in cause ? String(cause.code) : "";
    if (["auth/argument-error", "auth/invalid-id-token", "auth/id-token-expired", "auth/id-token-revoked"].includes(code)) {
      return NextResponse.json({ error: "Sign-in could not be verified. Please sign in again." }, { status: 401 });
    }
    return NextResponse.json({ error: "Authentication service is temporarily unavailable." }, { status: 500 });
  }
}
