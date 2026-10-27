export const EMAIL_ELIGIBILITY_MESSAGES = {
  disposable: "Temporary email addresses aren't accepted. Please use a permanent email address to submit your application.",
  free: "Please use your business email address to apply so we can verify your professional contact details.",
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
