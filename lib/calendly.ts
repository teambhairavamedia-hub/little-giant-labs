export const CALENDLY_BASE_URL =
  "https://calendly.com/hello-littlegiantlabs/brand-strategy-discussion-meeting";

/**
 * A single fixed palette used regardless of the website's light/dark theme.
 *
 * Background (#162638): dark-navy panel — the natural next step in the site's
 * own surface progression (--lgl-bg → --lgl-section → --lgl-surface → here).
 * Blends into the dark page via border; reads as a deliberate dark booking
 * card on the light page.
 *
 * Text (#F8F6F0): exact --lgl-fg dark-theme token. 13.7:1 contrast on bg.
 *
 * Primary (#C5A059): brand gold (--lgl-gold dark). Calendly auto-selects dark
 * charcoal button text on this luminance level, yielding ~7:1 (AAA) on the
 * gold button — identical to the site's own lgl-gold-cta treatment.
 *
 * Keeping one URL means the iframe is never recreated when the user toggles
 * the website theme, so booking progress is always preserved.
 */
export const CALENDLY_PALETTE = {
  background_color: "162638",
  text_color: "f8f6f0",
  primary_color: "c5a059",
} as const;

export function buildCalendlyUrl(): string {
  const searchParams = new URLSearchParams({
    hide_gdpr_banner: "1",
    background_color: CALENDLY_PALETTE.background_color,
    text_color: CALENDLY_PALETTE.text_color,
    primary_color: CALENDLY_PALETTE.primary_color,
  });
  return `${CALENDLY_BASE_URL}?${searchParams.toString()}`;
}
