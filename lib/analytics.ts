// Conversion events for Google Analytics 4 and the Meta Pixel. Both are optional: they load only when their IDs are
// set (NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_META_PIXEL_ID), and every call here is a no-op without them.

export type ConversionEvent = "generate_lead" | "whatsapp_click" | "email_click" | "phone_click" | "book_call_click" | "book_meeting";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// IDs are checked, so a mistyped value can never inject anything into the page
export function gaMeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
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
