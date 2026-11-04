export const EMAIL_ELIGIBILITY_MESSAGES = {
  disposable: "Temporary email addresses aren't accepted. Please use a permanent email address to send your enquiry.",
  free: "Please use your work email address so we can verify your professional contact details.",
} as const;

export type EmailEligibilityOutcome = "eligible" | "disposable" | "free";

export function isEmailFormatValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export class EmailEligibilityError extends Error {
  readonly outcome: Exclude<EmailEligibilityOutcome, "eligible">;
  readonly code: "DISPOSABLE_EMAIL" | "FREE_EMAIL_PROVIDER";

  constructor(outcome: Exclude<EmailEligibilityOutcome, "eligible">) {
    super(EMAIL_ELIGIBILITY_MESSAGES[outcome]);
    this.name = "EmailEligibilityError";
    this.outcome = outcome;
    this.code = outcome === "disposable" ? "DISPOSABLE_EMAIL" : "FREE_EMAIL_PROVIDER";
  }
}

export class EmailDatasetInitializationError extends Error {
  constructor() {
    super("Email eligibility datasets could not be initialized.");
    this.name = "EmailDatasetInitializationError";
  }
}

/**
 * Extracts and normalizes the email domain from an email address for organisation-level grouping.
 * Returns the lowercase, trimmed domain name, or null if invalid.
 */
export function extractEmailDomain(email: string): string | null {
  if (!email || typeof email !== "string") return null;
  const trimmed = email.trim().toLowerCase();
  if (!isEmailFormatValid(trimmed)) return null;
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex === -1 || atIndex === 0 || atIndex === trimmed.length - 1) return null;
  return trimmed.slice(atIndex + 1);
}

export const normalizeEmailDomain = extractEmailDomain;
