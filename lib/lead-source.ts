// Where an enquiry came from: campaign tags on the visitor's landing link (UTM and ad click IDs), the external
// site that referred them, and the page they first landed on. Captured in the browser, checked again on the server.

export const LEAD_SOURCE_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "fbclid", "referrer", "landing_page",
] as const;

export type LeadSourceKey = (typeof LEAD_SOURCE_KEYS)[number];
export type LeadSource = Partial<Record<LeadSourceKey, string>>;

const MAX_LENGTH: Record<LeadSourceKey, number> = {
  utm_source: 100, utm_medium: 100, utm_campaign: 200, utm_term: 200, utm_content: 200,
  gclid: 200, fbclid: 300, referrer: 300, landing_page: 300,
};
const CAMPAIGN_PARAMS = LEAD_SOURCE_KEYS.filter((key) => key !== "referrer" && key !== "landing_page");
const STORAGE_KEY = "lgl-lead-source";

/**
 * Keeps only known keys with non-empty strings, without control characters and within length limits.
 * Returns null when nothing usable remains, so blank sources are stored as NULL.
 */
export function normalizeLeadSource(value: unknown): LeadSource | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const out: LeadSource = {};
  for (const key of LEAD_SOURCE_KEYS) {
    const raw = input[key];
    if (typeof raw !== "string") continue;
    const clean = raw.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, MAX_LENGTH[key]);
    if (clean) out[key] = clean;
  }
  return Object.keys(out).length ? out : null;
}

/** A short label for the admin list and the alert email: "linkedin / social", "google.com" or "Direct". */
export function describeLeadSource(source: LeadSource | null | undefined): string {
  if (!source) return "Direct";
  if (source.utm_source) return source.utm_medium ? `${source.utm_source} / ${source.utm_medium}` : source.utm_source;
  if (source.gclid) return "Google Ads";
  if (source.fbclid) return "Facebook / Instagram";
  if (source.referrer) {
    try { return new URL(source.referrer).hostname.replace(/^www\./, ""); } catch { return source.referrer; }
  }
  return "Direct";
}

/**
 * Browser only. Records the source of this visit: a link with campaign tags replaces what was stored (the latest
 * campaign wins); otherwise the first visit's source is kept. Query strings are dropped from the landing page and
 * referrer, so nothing personal in other parameters is stored.
 */
export function captureLeadSource(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const hasCampaign = CAMPAIGN_PARAMS.some((key) => params.get(key));
    if (!hasCampaign && window.localStorage.getItem(STORAGE_KEY)) return;
    const source: Record<string, string> = {};
    for (const key of CAMPAIGN_PARAMS) {
      const value = params.get(key);
      if (value) source[key] = value;
    }
    if (document.referrer) {
      const referrer = new URL(document.referrer);
      if (referrer.origin !== window.location.origin) source.referrer = `${referrer.origin}${referrer.pathname}`;
    }
    source.landing_page = window.location.pathname;
    const normalized = normalizeLeadSource(source);
    if (normalized) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    /* storage unavailable or malformed referrer: the enquiry is simply sent without a source */
  }
}

/** Browser only. The stored source for the enquiry form, or null. */
export function readLeadSource(): LeadSource | null {
  if (typeof window === "undefined") return null;
  try {
    return normalizeLeadSource(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    return null;
  }
}
