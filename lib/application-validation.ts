export const applicationOptions = {
  industry_vertical: [
    "Enterprise Banking & FinTech",
    "Heavy Infrastructure & Real Estate",
    "Premium Consumer Goods (D2C)",
    "Venture-Backed Technology",
    "High-Ticket B2B Services",
  ],
  ttm_revenue: ["Under $1 Million", "$1M – $5 Million", "$5M – $20 Million", "$20 Million+"],
  monthly_ad_spend: ["Under $10,000 / month", "$10,000 – $50,000 / month", "$50,000 – $150,000 / month", "$150,000+ / month"],
  growth_bottleneck: [
    "Ad platform algorithmic fatigue & dropping ROAS",
    "Inability to produce high-retention visual media at scale",
    "Lack of advanced attribution models and data tracking",
    "Sub-optimal customer lifetime value (LTV) and backend CRM systems",
  ],
  partnership_readiness: [
    "We are looking for a cheap, hands-off execution vendor",
    "We are prepared to invest premium capital for institutional scale and long-term partnership",
  ],
} as const;

export type ApplicationInput = {
  legal_name: string;
  industry_vertical: string;
  ttm_revenue: string;
  monthly_ad_spend: string;
  growth_bottleneck: string;
  partnership_readiness: string;
  decision_maker_email: string;
  decision_maker_linkedin: string;
};

export type ValidatedApplication = ApplicationInput & {
  qualification_status: "qualified" | "rejected";
  rejection_reasons: string[];
};

export class ValidationError extends Error {
  constructor(message: string) { super(message); this.name = "ValidationError"; }
}

const fields = Object.keys(applicationOptions);
const requiredFields = ["legal_name", ...fields, "decision_maker_email", "decision_maker_linkedin"] as const;
const blockedEmailDomains = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.co.in", "ymail.com",
  "hotmail.com", "outlook.com", "live.com", "icloud.com", "me.com", "aol.com", "proton.me", "protonmail.com",
]);

export function normalizeCorporateEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("Enter a valid corporate email address.");
  }
  const domain = email.slice(email.lastIndexOf("@") + 1);
  if ([...blockedEmailDomains].some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`))) {
    throw new ValidationError("Use your organization’s email address. Consumer email providers are not accepted.");
  }
  return email;
}

export function normalizeLinkedInUrl(value: string): string {
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new ValidationError("Enter a valid LinkedIn profile URL."); }
  if (url.protocol !== "https:" || !["linkedin.com", "www.linkedin.com"].includes(url.hostname.toLowerCase()) || url.username || url.password || url.search || url.hash || !/^\/in\/[A-Za-z0-9_%.-]+\/?$/.test(url.pathname)) {
    throw new ValidationError("Enter a valid LinkedIn profile URL, such as https://www.linkedin.com/in/your-profile.");
  }
  return url.toString();
}

export function validateApplication(body: unknown): ValidatedApplication {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ValidationError("Submit a valid application.");
  const input = body as Record<string, unknown>;
  for (const field of requiredFields) {
    if (typeof input[field] !== "string" || !input[field].trim()) throw new ValidationError("Complete all required fields before submitting.");
  }
  const legal_name = (input.legal_name as string).trim();
  if (legal_name.length > 200) throw new ValidationError("The legal enterprise name is too long.");
  const answers: Record<string, string> = {};
  for (const [field, options] of Object.entries(applicationOptions)) {
    const answer = (input[field] as string).trim();
    if (!(options as readonly string[]).includes(answer)) throw new ValidationError("One or more answers are invalid. Review your selections and try again.");
    answers[field] = answer;
  }
  const rejection_reasons: string[] = [];
  if (answers.ttm_revenue === "Under $1 Million") rejection_reasons.push("ttm_revenue_below_1m");
  if (answers.monthly_ad_spend === "Under $10,000 / month") rejection_reasons.push("monthly_ad_spend_below_10k");
  if (answers.partnership_readiness === applicationOptions.partnership_readiness[0]) rejection_reasons.push("cheap_execution_vendor");

  return {
    legal_name,
    ...answers,
    decision_maker_email: normalizeCorporateEmail(input.decision_maker_email as string),
    decision_maker_linkedin: normalizeLinkedInUrl(input.decision_maker_linkedin as string),
    qualification_status: rejection_reasons.length ? "rejected" : "qualified",
    rejection_reasons,
  } as ValidatedApplication;
}
