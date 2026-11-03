// Conversion events for Google Analytics 4 and the Meta Pixel. GA4 defaults to the site's property; a valid
// NEXT_PUBLIC_GA_MEASUREMENT_ID overrides it. The Meta Pixel loads only when NEXT_PUBLIC_META_PIXEL_ID is set.
// Every call here is a no-op in the browser without the corresponding global.

const DEFAULT_GA_MEASUREMENT_ID = "G-8QYEK1Z4C8";

export type ConversionEvent = "generate_lead" | "whatsapp_click" | "email_click" | "phone_click" | "book_call_click" | "book_meeting";

export type EnquiryEvent =
  | "enquiry_form_start"
  | "enquiry_step_complete"
  | "enquiry_submit_attempt"
  | "enquiry_submit_success"
  | "enquiry_submit_error";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// IDs are checked, so a mistyped value can never inject anything into the page
export function gaMeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || DEFAULT_GA_MEASUREMENT_ID;
  return id && /^G-[A-Z0-9]{4,20}$/.test(id) ? id : null;
}

export function metaPixelId(): string | null {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id && /^\d{5,20}$/.test(id) ? id : null;
}

// Meta's standard event for each conversion
const META_EVENTS: Record<ConversionEvent, string> = {
  generate_lead: "Lead",
  whatsapp_click: "Contact",
  email_click: "Contact",
  phone_click: "Contact",
  book_call_click: "Contact",
  book_meeting: "Schedule",
};

export function trackEvent(event: ConversionEvent, params: Record<string, string> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
    window.fbq?.("track", META_EVENTS[event], params);
  } catch {
    /* analytics must never break the page */
  }
}

// Enquiry-form events go to GA4 only. Callers pass fixed labels and status codes, never form values.
export function trackEnquiryEvent(
  event: EnquiryEvent,
  params: Record<string, string | number> = {},
): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, { form_name: "enquiry", ...params });
  } catch {
    /* analytics must never break the form */
  }
}
