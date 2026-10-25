import { en } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";
import { es } from "./es";
import { de } from "./de";
import { defaultLocale, type Locale } from "../config";
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
