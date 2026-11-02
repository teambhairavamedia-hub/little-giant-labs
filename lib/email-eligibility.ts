// Any well-formed address is accepted, including Gmail, Yahoo, Outlook and other personal providers.
// Only temporary (disposable) inboxes are refused, because replies to them never reach a real person.
export const EMAIL_ELIGIBILITY_MESSAGES = {
  disposable: "Temporary email addresses aren't accepted. Please use a permanent email address to send your enquiry.",
} as const;

export type EmailEligibilityOutcome = "eligible" | "disposable";

export function isEmailFormatValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export class EmailEligibilityError extends Error {
  readonly outcome: Exclude<EmailEligibilityOutcome, "eligible">;
  readonly code: "DISPOSABLE_EMAIL";

  constructor(outcome: Exclude<EmailEligibilityOutcome, "eligible">) {
    super(EMAIL_ELIGIBILITY_MESSAGES[outcome]);
    this.name = "EmailEligibilityError";
    this.outcome = outcome;
    this.code = "DISPOSABLE_EMAIL";
  }
}

export class EmailDatasetInitializationError extends Error {
  constructor() {
    super("Email eligibility datasets could not be initialized.");
    this.name = "EmailDatasetInitializationError";
  }
}
