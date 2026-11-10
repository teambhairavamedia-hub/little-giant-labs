import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { retentionCutoff } from "@/lib/global-settings";
import { readGlobalSettings } from "@/lib/global-settings-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/* Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when the CRON_SECRET env var is set. */
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/* Daily clean-up (scheduled in vercel.json): deletes enquiries older than the retention period set in the admin
   dashboard. Their email jobs go with them (ON DELETE CASCADE). Does nothing while no retention period is set. */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return json({ error: "Unauthorized." }, 401);

  try {
    const { dataRetentionDays } = await readGlobalSettings();
    if (!dataRetentionDays) return json({ ok: true, deleted: 0, reason: "No retention period is set." });

    const cutoff = retentionCutoff(dataRetentionDays).toISOString();
    const { data, error } = await createSupabaseServerClient()
      .from("growth_applications")
      .delete()
      .lt("submitted_at", cutoff)
      .select("id");
    if (error) return json({ error: "Clean-up failed." }, 500);
    return json({ ok: true, deleted: data?.length ?? 0, retentionDays: dataRetentionDays, cutoff });
  } catch {
    return json({ error: "Clean-up failed." }, 500);
  }
}
