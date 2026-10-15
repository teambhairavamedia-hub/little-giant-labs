import { NextRequest, NextResponse } from "next/server";
import { firebaseAdminAuth } from "@/lib/firebase/admin";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import { hasSameOrigin } from "@/lib/admin-request";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    try {
      const claims = await firebaseAdminAuth().verifySessionCookie(token);
      await firebaseAdminAuth().revokeRefreshTokens(claims.uid);
    } catch { /* Clear the browser cookie even when the session is already invalid. */ }
  }
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
