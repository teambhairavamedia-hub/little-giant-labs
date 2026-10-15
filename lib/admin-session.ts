import "server-only";
import { cookies } from "next/headers";
import { firebaseAdminAuth } from "@/lib/firebase/admin";

export const ADMIN_SESSION_COOKIE = "__Host-bhairava-admin-session";
export const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const claims = await firebaseAdminAuth().verifySessionCookie(token, true);
    if (claims.email_verified !== true) return null;
    return claims;
  } catch {
    return null;
  }
}
