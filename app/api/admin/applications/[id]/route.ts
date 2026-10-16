import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (message: string, status: number) => NextResponse.json({ error: message }, {
  status,
  headers: { "Cache-Control": "no-store" },
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) return fail("Authentication is required.", 401);

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return fail("A valid application ID is required.", 400);
  }

  try {
    const { data, error } = await createSupabaseServerClient()
      .from("growth_applications")
      .select("id, legal_name, industry_vertical, ttm_revenue, monthly_ad_spend, growth_bottleneck, partnership_readiness, decision_maker_email, decision_maker_linkedin, qualification_status, rejection_reasons, submitted_at")
      .eq("id", id)
      .maybeSingle();

    if (error) return fail("Application details are temporarily unavailable.", 500);
    if (!data) return fail("Application not found.", 404);

    return NextResponse.json({ application: data }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail("Application details are temporarily unavailable.", 500);
  }
}
