import { after, NextResponse } from "next/server";
import { isTurnstileRequired, TURNSTILE_TOKEN_HEADER, verifyTurnstileToken } from "@/lib/turnstile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { handleApplicationSubmission, isIdempotencyConflict, SubmissionConflictError } from "@/lib/application-submission";
import { buildCreateApplicationWithEmailJobArgs } from "@/lib/application-verification";
import { sendLeadNotification } from "@/lib/lead-notification";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // "Are you a robot?" check, when Turnstile is configured: refused before anything is validated or saved.
  // Requests from another site skip it, since the submission handler refuses those anyway.
  const origin = request.headers.get("origin");
  const sameSite = !origin || origin === new URL(request.url).origin;
  if (isTurnstileRequired() && sameSite) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    if (!(await verifyTurnstileToken(request.headers.get(TURNSTILE_TOKEN_HEADER), ip))) {
      return NextResponse.json(
        { error: "Please complete the \"I am human\" check and try again." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
  }
  return handleApplicationSubmission(request, async (application, metadata) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.rpc(
      "create_application_with_email_job",
      buildCreateApplicationWithEmailJobArgs(application, metadata),
    );
    if (isIdempotencyConflict(error)) {
      throw new SubmissionConflictError();
    }
    // Preserve PostgREST's original metadata for the submission handler's redacted diagnostic log.
    if (error) throw error;
    // Saved: alert the team once the visitor already has their response, so email never delays or fails the form
    const adminUrl = new URL("/admin", request.url).toString();
    after(() => sendLeadNotification(application, adminUrl));
  });
}
