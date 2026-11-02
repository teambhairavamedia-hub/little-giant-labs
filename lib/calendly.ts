import { type ColorTheme } from "./theme.ts";

export const CALENDLY_BASE_URL =
  "https://calendly.com/hello-littlegiantlabs/brand-strategy-discussion-meeting-clone";

export const CALENDLY_THEME_CONFIG: Record<
  ColorTheme,
  { background_color: string; text_color: string; primary_color: string }
> = {
  dark: {
    background_color: "0b1b2b",
    text_color: "f8f6f0",
    primary_color: "c5a059",
  },
  light: {
    background_color: "f8f6f0",
    text_color: "0b1b2b",
    primary_color: "85611f",
  },
};

export function buildCalendlyUrl(theme: ColorTheme): string {
  const params = CALENDLY_THEME_CONFIG[theme] ?? CALENDLY_THEME_CONFIG.light;
  const searchParams = new URLSearchParams({
    background_color: params.background_color,
    text_color: params.text_color,
    primary_color: params.primary_color,
  });
  return `${CALENDLY_BASE_URL}?${searchParams.toString()}`;
}
