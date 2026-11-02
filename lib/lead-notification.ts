import type { ValidatedApplication } from "./application-validation.ts";

/* Emails the team when a new enquiry has been saved, through Resend's HTTP API (no SDK dependency).
   Optional: without RESEND_API_KEY, LEAD_NOTIFICATION_TO and LEAD_NOTIFICATION_FROM it does nothing, and a failed
   send is logged without personal data. Either way the enquiry itself is already stored. */

const RESEND_URL = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8_000;

export type LeadNotificationConfig = { apiKey: string; to: string[]; from: string };

export function getLeadNotificationConfig(env: Record<string, string | undefined> = process.env): LeadNotificationConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.LEAD_NOTIFICATION_FROM?.trim();
  const to = (env.LEAD_NOTIFICATION_TO ?? "").split(",").map((address) => address.trim()).filter(Boolean);
  if (!apiKey || !from || to.length === 0) return null;
  return { apiKey, to, from };
}

// Header-safe single line: no control characters (so no header injection), trimmed to a readable length.
function oneLine(value: string, max: number): string {
  const line = value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}

export function buildLeadEmail(application: ValidatedApplication, adminUrl: string): { subject: string; text: string } {
  const subject = oneLine(`New enquiry: ${application.legal_name} (${application.help_with})`, 150);
  // Plain text only, so nothing the visitor typed can be rendered as HTML in the inbox.
  const text = [
    "A new enquiry was submitted on the Little Giant Labs website.",
    "",
    `Name: ${oneLine(application.contact_name, 200)}`,
    `Email: ${application.decision_maker_email}`,
    `Phone / WhatsApp: ${application.contact_phone ?? "Not given"}`,
    `Company: ${oneLine(application.legal_name, 300)}`,
    `Role: ${application.contact_role ?? "Not given"}`,
    `Help with: ${application.help_with}`,
    `Timeline: ${application.timeline ?? "Not given"}`,
    "",
    "Their challenge:",
    application.project_details,
    "",
    "Reply to this email to answer them directly.",
    `All enquiries: ${adminUrl}`,
  ].join("\n");
  return { subject, text };
}

export async function sendLeadNotification(
  application: ValidatedApplication,
  adminUrl: string,
  config: LeadNotificationConfig | null = getLeadNotificationConfig(),
  fetchImpl: typeof fetch = fetch,
): Promise<"sent" | "skipped" | "failed"> {
  if (!config) return "skipped";
  const { subject, text } = buildLeadEmail(application, adminUrl);
  try {
    const response = await fetchImpl(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: config.from, to: config.to, reply_to: application.decision_maker_email, subject, text }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (response.ok) return "sent";
    console.error("Lead notification email failed", { status: response.status });
  } catch (error) {
    console.error("Lead notification email failed", { reason: error instanceof Error ? error.name : "unknown" });
  }
  return "failed";
}
