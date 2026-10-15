export type SectionTheme = "dark" | "light";

export const sectionThemeClass: Record<SectionTheme, string> = {
  dark: "section-dark",
  light: "section-light",
};

/* ── Site colour theme (light / dark toggle) ── */
export type ColorTheme = "dark" | "light";

export const DEFAULT_COLOR_THEME: ColorTheme = "dark";
export const THEME_STORAGE_KEY = "lgl-theme";

/* Runs in <head> before first paint so the saved theme never flashes. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="light"||t==="dark"?t:"${DEFAULT_COLOR_THEME}"}catch(e){document.documentElement.dataset.theme="${DEFAULT_COLOR_THEME}"}})()`;

export function getColorTheme(): ColorTheme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setColorTheme(theme: ColorTheme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable (private mode) — theme still applies for this visit */
  }
}

/* Notifies on theme changes from this tab or from another open tab. */
export function subscribeColorTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    document.documentElement.dataset.theme = event.newValue === "light" ? "light" : DEFAULT_COLOR_THEME;
  };
  window.addEventListener("storage", onStorage);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStorage);
  };
}
