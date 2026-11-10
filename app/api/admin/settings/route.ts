import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { hasSameOrigin } from "@/lib/admin-request";
import { parseRetentionDays } from "@/lib/global-settings";
import { readGlobalSettings, saveRetentionDays } from "@/lib/global-settings-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
const fail = (message: string, status: number) => json({ error: message }, status);

/* The site-wide settings, for the admin dashboard */
export async function GET() {
  if (!(await getAdminSession())) return fail("Authentication is required.", 401);
  try {
    return json({ settings: await readGlobalSettings() });
  } catch {
    return fail("Settings are unavailable. Check that the global_settings migration has been applied.", 503);
  }
}

/* Changes the data retention period. Breach notifications are not configurable yet ("coming soon"). */
export async function PATCH(request: NextRequest) {
  if (!hasSameOrigin(request)) return fail("Request origin could not be verified.", 403);
  const session = await getAdminSession();
  if (!session) return fail("Authentication is required.", 401);

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 1024) return fail("Request is too large.", 413);
    body = JSON.parse(raw);
  } catch {
    return fail("Invalid request body.", 400);
  }
  if (!body || typeof body !== "object" || !("dataRetentionDays" in body)) return fail("Invalid request.", 400);

  const parsed = parseRetentionDays((body as { dataRetentionDays: unknown }).dataRetentionDays);
  if (!parsed.ok) return fail(parsed.error, 400);

  try {
    const updatedBy = typeof session.email === "string" ? session.email : null;
    return json({ settings: await saveRetentionDays(parsed.days, updatedBy) });
  } catch {
    return fail("Settings could not be saved. Check that the global_settings migration has been applied.", 503);
  }
}
