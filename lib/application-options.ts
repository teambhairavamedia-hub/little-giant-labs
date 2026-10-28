// Canonical enquiry answers, shared by the contact form (client), server validation and the database
// CHECK constraints (supabase/migrations/202610290001_contact_enquiry_fields.sql). Stored values are
// these English strings; the form shows localized labels keyed by them (dict.contact.form.fields.*.options).
export const applicationOptions = {
  help_with: [
    "Brand strategy & positioning",
    "Creative & content",
    "Digital marketing & growth",
    "Employer brand & talent communication",
    "Not sure yet / help me decide",
  ],
  company_size: ["1–10 people", "11–50 people", "51–200 people", "201–1,000 people", "1,000+ people"],
  industry_vertical: [
    "Technology & SaaS",
    "Financial services & fintech",
    "Consumer, retail & D2C",
    "Media, entertainment & music",
    "Real estate & infrastructure",
    "Professional & B2B services",
    "Healthcare & life sciences",
    "Education",
    "Other",
  ],
  budget_range: ["Under $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "$50,000+", "Not sure yet"],
  timeline: ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Flexible / not decided"],
} as const;

export type ApplicationOptionField = keyof typeof applicationOptions;

/** Required answer fields; every other option field may be left blank (stored as NULL). */
export const requiredOptionFields = ["help_with"] as const satisfies readonly ApplicationOptionField[];
export const optionalOptionFields = ["company_size", "industry_vertical", "budget_range", "timeline"] as const satisfies readonly ApplicationOptionField[];

export const APPLICATION_LIMITS = {
  contactName: 120,
  companyName: 255,
  projectDetails: 2000,
} as const;
