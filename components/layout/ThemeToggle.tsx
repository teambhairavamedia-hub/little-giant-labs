"use client";

import { useSyncExternalStore } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  DEFAULT_COLOR_THEME,
  getColorTheme,
  setColorTheme,
  subscribeColorTheme,
} from "@/lib/theme";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { dict } = useI18n();
  const theme = useSyncExternalStore(subscribeColorTheme, getColorTheme, () => DEFAULT_COLOR_THEME);
  const isDark = theme === "dark";
  const label = isDark ? dict.nav.switchToLight : dict.nav.switchToDark;

  return (
    <button
      type="button"
      onClick={() => setColorTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="flex w-11 h-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lgl-gold"
      style={{
        background: "var(--lgl-nav-chip)",
        border: "1px solid var(--lgl-nav-border)",
        color: "var(--lgl-nav-fg)",
      }}
    >
      {/* Shows the mode you will switch to */}
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
