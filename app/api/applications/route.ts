import { createSupabaseServerClient } from "@/lib/supabase/server";
import { handleApplicationSubmission } from "@/lib/application-submission";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleApplicationSubmission(request, async (application) => {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("growth_applications").insert(application);
    // Preserve PostgREST's original metadata for the submission handler's redacted diagnostic log.
    if (error) throw error;
  });
}
