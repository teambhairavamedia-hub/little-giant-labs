export const locales = ["en", "hi", "mr", "es", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export interface LocaleInfo {
  code: Locale;
  name: string;
  englishName: string;
  dir: "ltr" | "rtl";
}

export const localeDetails: Record<Locale, LocaleInfo> = {
  en: { code: "en", name: "English", englishName: "English", dir: "ltr" },
  hi: { code: "hi", name: "हिन्दी", englishName: "Hindi", dir: "ltr" },
  mr: { code: "mr", name: "मराठी", englishName: "Marathi", dir: "ltr" },
  es: { code: "es", name: "Español", englishName: "Spanish", dir: "ltr" },
  de: { code: "de", name: "Deutsch", englishName: "German", dir: "ltr" },
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale {
  if (!pathname) return defaultLocale;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isValidLocale(first)) {
    return first;
  }
  return defaultLocale;
}

export function stripLocaleFromPathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    const remaining = segments.slice(1).join("/");
    return remaining ? `/${remaining}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  // Preserve hash and search params if present
  let cleanPath = pathname || "/";
  let suffix = "";

  const hashIdx = cleanPath.indexOf("#");
  if (hashIdx >= 0) {
    suffix = cleanPath.slice(hashIdx);
    cleanPath = cleanPath.slice(0, hashIdx);
  }

  const queryIdx = cleanPath.indexOf("?");
  if (queryIdx >= 0) {
    suffix = cleanPath.slice(queryIdx) + suffix;
    cleanPath = cleanPath.slice(0, queryIdx);
  }

  const stripped = stripLocaleFromPathname(cleanPath);

  if (targetLocale === defaultLocale) {
    return (stripped || "/") + suffix;
  }

  const base = stripped === "/" ? `/${targetLocale}` : `/${targetLocale}${stripped}`;
  return base + suffix;
}
