import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSameOrigin } from "@/lib/admin-request";
import { ADMIN_SEARCH_MAX_LENGTH, adminSearchFilter, normalizeAdminSearch } from "@/lib/admin-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE_DEFAULT = 25;
const PAGE_SIZE_MAX = 100;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_STATUSES = ["pending_review", "qualified", "rejected"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

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
  // Optional search by company or brand name, email or contact name
  const search = normalizeAdminSearch(request.nextUrl.searchParams.get("q"));
  if (search === null) return fail(`Search must be ${ADMIN_SEARCH_MAX_LENGTH} characters or fewer.`, 400);

  try {
    const supabase = createSupabaseServerClient();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - SEVEN_DAYS_MS).toISOString();
    const from = (page - 1) * pageSize;
    if (!Number.isSafeInteger(from)) return fail("The requested page is out of range.", 400);

    // The list (and its pagination) follows the search; the metrics always cover every application
    const listQuery = supabase.from("growth_applications")
      .select("id, legal_name, contact_name, help_with, qualification_status, submitted_at, decision_maker_email, contact_phone, lead_source", { count: "exact" });
    const [applicationsResult, totalResult, recentResult, qualifiedRecentResult, qualifiedResult, rejectedResult] = await Promise.all([
      (search ? listQuery.or(adminSearchFilter(search)) : listQuery)
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
    const matching = search ? applicationsResult.count ?? 0 : total;
    const totalPages = Math.ceil(matching / pageSize);
    if (page > Math.max(totalPages, 1)) return fail("The requested page is out of range.", 416);
    const qualified = qualifiedResult.count ?? 0;
    const rejected = rejectedResult.count ?? 0;
    const pendingReviewResult = await supabase.from("growth_applications").select("id", { count: "exact", head: true }).eq("qualification_status", "pending_review");
    if (pendingReviewResult.error) return fail("Application data is temporarily unavailable.", 500);
    return NextResponse.json({
      applications: applicationsResult.data ?? [],
      pagination: { page, pageSize, total: matching, totalPages },
      search,
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

export async function PATCH(request: NextRequest) {
  if (!hasSameOrigin(request)) return fail("Request origin could not be verified.", 403);
  if (!(await getAdminSession())) return fail("Authentication is required.", 401);

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 32_768) return fail("Request is too large.", 413);

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 32_768) {
      return fail("Request is too large.", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return fail("Invalid request body.", 400);
  }

  if (!body || typeof body !== "object") return fail("Invalid request.", 400);
  const { ids, status } = body as { ids?: unknown; status?: unknown };

  if (typeof status !== "string" || !ALLOWED_STATUSES.includes(status as AllowedStatus)) {
    return fail("A valid status is required ('pending_review', 'qualified', or 'rejected').", 400);
  }

  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 100) {
    return fail("A non-empty list of up to 100 application IDs is required.", 400);
  }

  const validIds: string[] = [];
  for (const id of ids) {
    if (typeof id !== "string" || !UUID_REGEX.test(id)) {
      return fail("All application IDs must be valid UUIDs.", 400);
    }
    validIds.push(id);
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("growth_applications")
      .update({ qualification_status: status })
      .in("id", validIds)
      .select("id");

    if (error) {
      return fail("Application status could not be updated.", 500);
    }

    return NextResponse.json({
      ok: true,
      updatedCount: data?.length ?? 0,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail("Application status could not be updated.", 500);
  }
}

