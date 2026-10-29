import { checkEmailEligibility } from "./email-domain-eligibility.ts";
import { EmailEligibilityError, isEmailFormatValid } from "./email-eligibility.ts";
import {
  APPLICATION_LIMITS,
  applicationOptions,
  optionalOptionFields,
  requiredOptionFields,
} from "./application-options.ts";

export { applicationOptions } from "./application-options.ts";

export type ApplicationInput = {
  contact_name: string;
  decision_maker_email: string;
  legal_name: string;
  help_with: string;
  project_details: string;
  contact_role?: string;
  timeline?: string;
};

export type ValidatedApplication = {
  contact_name: string;
  decision_maker_email: string;
  legal_name: string;
  help_with: string;
  project_details: string;
  contact_role: string | null;
  timeline: string | null;
  qualification_status: "pending_review";
};

export class ValidationError extends Error {
  constructor(message: string) { super(message); this.name = "ValidationError"; }
}

const requiredTextFields = ["contact_name", "decision_maker_email", "legal_name", "project_details", ...requiredOptionFields] as const;

export async function normalizeCorporateEmail(value: string): Promise<string> {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !isEmailFormatValid(email)) {
    throw new ValidationError("Enter a valid work email address.");
  }
  const outcome = await checkEmailEligibility(email);
  if (outcome !== "eligible") throw new EmailEligibilityError(outcome);
  return email;
}

function isOption(field: keyof typeof applicationOptions, value: string): boolean {
  return (applicationOptions[field] as readonly string[]).includes(value);
}

export async function validateApplication(body: unknown): Promise<ValidatedApplication> {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ValidationError("Submit a valid enquiry.");
  const input = body as Record<string, unknown>;
  for (const field of requiredTextFields) {
    if (typeof input[field] !== "string" || !input[field].trim()) throw new ValidationError("Complete all required fields before submitting.");
  }

  const contact_name = (input.contact_name as string).trim();
  if (contact_name.length > APPLICATION_LIMITS.contactName) throw new ValidationError("Your name is too long.");
  const legal_name = (input.legal_name as string).trim();
  if (legal_name.length > APPLICATION_LIMITS.companyName) throw new ValidationError("The company or brand name is too long.");
  const project_details = (input.project_details as string).trim();
  if (project_details.length > APPLICATION_LIMITS.projectDetails) {
    throw new ValidationError(`Keep your project description under ${APPLICATION_LIMITS.projectDetails} characters.`);
  }

  const help_with = (input.help_with as string).trim();
  if (!isOption("help_with", help_with)) throw new ValidationError("One or more answers are invalid. Review your selections and try again.");

  // Optional answers: missing or blank → null; anything else must be a listed option.
  const optional: Record<(typeof optionalOptionFields)[number], string | null> = {
    contact_role: null, timeline: null,
  };
  for (const field of optionalOptionFields) {
    const raw = input[field];
    if (raw === undefined || raw === null || (typeof raw === "string" && !raw.trim())) continue;
    if (typeof raw !== "string" || !isOption(field, raw.trim())) {
      throw new ValidationError("One or more answers are invalid. Review your selections and try again.");
    }
    optional[field] = raw.trim();
  }

  const decision_maker_email = await normalizeCorporateEmail(input.decision_maker_email as string);

  return {
    contact_name,
    decision_maker_email,
    legal_name,
    help_with,
    project_details,
    ...optional,
    qualification_status: "pending_review",
  };
}
