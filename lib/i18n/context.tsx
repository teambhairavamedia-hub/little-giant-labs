"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  defaultLocale,
  getLocaleFromPathname,
  getLocalizedPath,
  type Locale,
} from "./config";
import { getDictionary } from "./dictionaries";
import type { TranslationDictionary } from "./types";

interface I18nContextValue {
  locale: Locale;
  dict: TranslationDictionary;
  switchLocale: (targetLocale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current locale from pathname or fallback to initialLocale/default
  const currentLocale = getLocaleFromPathname(pathname) || initialLocale || defaultLocale;
  const [locale, setLocaleState] = useState<Locale>(currentLocale);

  // Sync state and document lang whenever pathname changes
  useEffect(() => {
    const detected = getLocaleFromPathname(pathname);
    setLocaleState(detected);
    if (typeof document !== "undefined") {
      document.documentElement.lang = detected;
    }
  }, [pathname]);

  const switchLocale = useCallback(
    (targetLocale: Locale) => {
      if (targetLocale === locale) return;

      // Persist user preference to cookie
      if (typeof document !== "undefined") {
        document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = targetLocale;
      }

      setLocaleState(targetLocale);
      const targetPath = getLocalizedPath(pathname, targetLocale);
      router.push(targetPath);
    },
    [locale, pathname, router]
  );

  const dict = getDictionary(locale);

  return (
    <I18nContext.Provider value={{ locale, dict, switchLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    const dict = getDictionary(defaultLocale);
    return {
      locale: defaultLocale,
      dict,
      switchLocale: () => {},
    };
  }
  return context;
}
