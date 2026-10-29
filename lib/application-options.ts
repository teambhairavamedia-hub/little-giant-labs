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
  contact_role: ["Founder / Owner", "Executive / Leadership", "Marketing / Brand", "People / Talent", "Product / Operations", "Other"],
  timeline: ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Flexible / not decided"],
} as const;

export type ApplicationOptionField = keyof typeof applicationOptions;

/** Required answer fields; every other option field may be left blank (stored as NULL). */
export const requiredOptionFields = ["help_with"] as const satisfies readonly ApplicationOptionField[];
export const optionalOptionFields = ["contact_role", "timeline"] as const satisfies readonly ApplicationOptionField[];

export const APPLICATION_LIMITS = {
  contactName: 120,
  companyName: 255,
  projectDetails: 2000,
} as const;
