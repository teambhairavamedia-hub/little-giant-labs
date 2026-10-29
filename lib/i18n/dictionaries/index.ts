import { en } from "./en.ts";
import { hi } from "./hi.ts";
import { mr } from "./mr.ts";
import { es } from "./es.ts";
import { de } from "./de.ts";
import { defaultLocale, type Locale } from "../config.ts";
import type { TranslationDictionary } from "../types";

export const dictionaries: Record<Locale, TranslationDictionary> = {
  en,
  hi,
  mr,
  es,
  de,
};

export function getDictionary(locale?: string): TranslationDictionary {
  if (locale && locale in dictionaries) {
    return dictionaries[locale as Locale];
  }
  return dictionaries[defaultLocale];
}

export { en, hi, mr, es, de };
