import { after } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { handleApplicationSubmission, isIdempotencyConflict, SubmissionConflictError } from "@/lib/application-submission";
import { buildCreateApplicationWithEmailJobArgs } from "@/lib/application-verification";
import { sendLeadNotification } from "@/lib/lead-notification";

export const runtime = "nodejs";

export async function POST(request: Request) {
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
