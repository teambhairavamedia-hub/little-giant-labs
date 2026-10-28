import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE_DEFAULT = 25;
const PAGE_SIZE_MAX = 100;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const fail = (message: string, status: number) => NextResponse.json({ error: message }, {
  status,
  headers: { "Cache-Control": "no-store" },
});

function integerParam(params: URLSearchParams, name: string, fallback: number): number | null {
  const value = params.get(name);
  if (value === null) return fallback;
  if (!/^[1-9]\d*$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export async function GET(request: NextRequest) {
  if (!(await getAdminSession())) return fail("Authentication is required.", 401);

  const page = integerParam(request.nextUrl.searchParams, "page", 1);
  const pageSize = integerParam(request.nextUrl.searchParams, "pageSize", PAGE_SIZE_DEFAULT);
  if (page === null || pageSize === null || pageSize > PAGE_SIZE_MAX) {
    return fail(`Page must be a positive integer and pageSize must be between 1 and ${PAGE_SIZE_MAX}.`, 400);
  }

  try {
    const supabase = createSupabaseServerClient();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - SEVEN_DAYS_MS).toISOString();
    const from = (page - 1) * pageSize;
    if (!Number.isSafeInteger(from)) return fail("The requested page is out of range.", 400);

    const [applicationsResult, totalResult, recentResult, qualifiedRecentResult, qualifiedResult, rejectedResult] = await Promise.all([
      supabase.from("growth_applications")
        .select("id, legal_name, contact_name, help_with, budget_range, qualification_status, submitted_at, decision_maker_email")
        .order("submitted_at", { ascending: false }).order("id", { ascending: false })
        .range(from, from + pageSize - 1),
      supabase.from("growth_applications").select("id", { count: "exact", head: true }),
      supabase.from("growth_applications").select("id", { count: "exact", head: true }).gte("submitted_at", sevenDaysAgo).lt("submitted_at", now.toISOString()),
      supabase.from("growth_applications").select("id", { count: "exact", head: true }).eq("qualification_status", "qualified").gte("submitted_at", sevenDaysAgo).lt("submitted_at", now.toISOString()),
      supabase.from("growth_applications").select("id", { count: "exact", head: true }).eq("qualification_status", "qualified"),
      supabase.from("growth_applications").select("id", { count: "exact", head: true }).eq("qualification_status", "rejected"),
    ]);

    if ([applicationsResult.error, totalResult.error, recentResult.error, qualifiedRecentResult.error, qualifiedResult.error, rejectedResult.error].some(Boolean)) {
      return fail("Application data is temporarily unavailable.", 500);
    }

    const total = totalResult.count ?? 0;
    const totalPages = Math.ceil(total / pageSize);
    if (page > Math.max(totalPages, 1)) return fail("The requested page is out of range.", 416);
    const qualified = qualifiedResult.count ?? 0;
    const rejected = rejectedResult.count ?? 0;
    const pendingReviewResult = await supabase.from("growth_applications").select("id", { count: "exact", head: true }).eq("qualification_status", "pending_review");
    if (pendingReviewResult.error) return fail("Application data is temporarily unavailable.", 500);
    return NextResponse.json({
      applications: applicationsResult.data ?? [],
      pagination: { page, pageSize, total, totalPages },
      metrics: {
        totalApplications: total,
        newApplicationsLast7Days: recentResult.count ?? 0,
        qualifiedApplicationsLast7Days: qualifiedRecentResult.count ?? 0,
        qualification: { qualified, rejected, pendingReview: pendingReviewResult.count ?? 0 },
        window: { startsAt: sevenDaysAgo, endsAt: now.toISOString() },
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail("Application data is temporarily unavailable.", 500);
  }
}
