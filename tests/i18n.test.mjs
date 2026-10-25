import { test } from "node:test";
import assert from "node:assert/strict";
import {
  locales,
  defaultLocale,
  isValidLocale,
  getLocaleFromPathname,
  stripLocaleFromPathname,
  getLocalizedPath,
  localeDetails,
} from "../lib/i18n/config.ts";
import { dictionaries, getDictionary } from "../lib/i18n/dictionaries/index.ts";

test("supported locales include all 5 requested languages", () => {
  assert.deepEqual(locales, ["en", "hi", "mr", "es", "de"]);
  assert.equal(defaultLocale, "en");
  assert.equal(localeDetails.en.name, "English");
  assert.equal(localeDetails.hi.name, "हिन्दी");
  assert.equal(localeDetails.mr.name, "मराठी");
  assert.equal(localeDetails.es.name, "Español");
  assert.equal(localeDetails.de.name, "Deutsch");
});

test("isValidLocale validates supported and rejects invalid locales", () => {
  for (const loc of ["en", "hi", "mr", "es", "de"]) {
    assert.equal(isValidLocale(loc), true);
  }
  for (const invalid of ["fr", "it", "ja", "zh", "admin", "api", ""]) {
    assert.equal(isValidLocale(invalid), false);
  }
});

test("getLocaleFromPathname extracts locale correctly", () => {
  assert.equal(getLocaleFromPathname("/"), "en");
  assert.equal(getLocaleFromPathname("/about"), "en");
  assert.equal(getLocaleFromPathname("/hi"), "hi");
  assert.equal(getLocaleFromPathname("/hi/"), "hi");
  assert.equal(getLocaleFromPathname("/hi/about"), "hi");
  assert.equal(getLocaleFromPathname("/mr/contact"), "mr");
  assert.equal(getLocaleFromPathname("/es/application-received"), "es");
  assert.equal(getLocaleFromPathname("/de/work"), "de");
  assert.equal(getLocaleFromPathname("/unknown/path"), "en");
});

test("stripLocaleFromPathname strips only valid locale prefix", () => {
  assert.equal(stripLocaleFromPathname("/"), "/");
  assert.equal(stripLocaleFromPathname("/about"), "/about");
  assert.equal(stripLocaleFromPathname("/hi"), "/");
  assert.equal(stripLocaleFromPathname("/hi/about"), "/about");
  assert.equal(stripLocaleFromPathname("/mr/contact"), "/contact");
  assert.equal(stripLocaleFromPathname("/es/application-received"), "/application-received");
  assert.equal(stripLocaleFromPathname("/de/work"), "/work");
  assert.equal(stripLocaleFromPathname("/admin/dashboard"), "/admin/dashboard");
});

test("getLocalizedPath preserves hash, search params, and formats properly", () => {
  // English to localized
  assert.equal(getLocalizedPath("/", "hi"), "/hi");
  assert.equal(getLocalizedPath("/about", "hi"), "/hi/about");
  assert.equal(getLocalizedPath("/contact", "de"), "/de/contact");
  assert.equal(getLocalizedPath("/#services", "es"), "/es#services");
  assert.equal(getLocalizedPath("/contact?ref=partner", "mr"), "/mr/contact?ref=partner");

  // Localized to English
  assert.equal(getLocalizedPath("/hi", "en"), "/");
  assert.equal(getLocalizedPath("/hi/about", "en"), "/about");
  assert.equal(getLocalizedPath("/es/contact", "en"), "/contact");
  assert.equal(getLocalizedPath("/de#services", "en"), "/#services");

  // Localized to another localized
  assert.equal(getLocalizedPath("/hi/about", "mr"), "/mr/about");
  assert.equal(getLocalizedPath("/es/contact", "de"), "/de/contact");
  assert.equal(getLocalizedPath("/mr#our-work", "es"), "/es#our-work");
});

test("all dictionaries exist and have matching top-level sections", () => {
  const expectedSections = [
    "locale",
    "localeName",
    "nav",
    "home",
    "about",
    "contact",
    "applicationReceived",
    "workUnavailable",
    "footer",
    "seo",
  ];

  for (const loc of locales) {
    const dict = getDictionary(loc);
    assert.ok(dict, `Dictionary for ${loc} should exist`);
    assert.equal(dict.locale, loc);
    for (const section of expectedSections) {
      assert.ok(dict[section], `Dictionary for ${loc} missing section: ${section}`);
    }
  }
});

test("form options map contains all canonical keys in every language", () => {
  const canonicalIndustries = [
    "Enterprise Banking & FinTech",
    "Heavy Infrastructure & Real Estate",
    "Premium Consumer Goods (D2C)",
    "Venture-Backed Technology",
    "High-Ticket B2B Services",
  ];

  const canonicalRevenues = [
    "Under $1 Million",
    "$1M – $5 Million",
    "$5M – $20 Million",
    "$20 Million+",
  ];

  const canonicalSpends = [
    "Under $10,000 / month",
    "$10,000 – $50,000 / month",
    "$50,000 – $150,000 / month",
    "$150,000+ / month",
  ];

  const canonicalBottlenecks = [
    "Ad platform algorithmic fatigue & dropping ROAS",
    "Inability to produce high-retention visual media at scale",
    "Lack of advanced attribution models and data tracking",
    "Sub-optimal customer lifetime value (LTV) and backend CRM systems",
  ];

  const canonicalPartnerships = [
    "We are looking for a cheap, hands-off execution vendor",
    "We are prepared to invest premium capital for institutional scale and long-term partnership",
  ];

  for (const loc of locales) {
    const dict = getDictionary(loc);
    const formFields = dict.contact.form.fields;

    for (const ind of canonicalIndustries) {
      assert.ok(
        formFields.industry.options[ind],
        `Language ${loc} missing translation for industry: ${ind}`
      );
    }
    for (const rev of canonicalRevenues) {
      assert.ok(
        formFields.revenue.options[rev],
        `Language ${loc} missing translation for revenue: ${rev}`
      );
    }
    for (const spend of canonicalSpends) {
      assert.ok(
        formFields.acquisitionSpend.options[spend],
        `Language ${loc} missing translation for spend: ${spend}`
      );
    }
    for (const b of canonicalBottlenecks) {
      assert.ok(
        formFields.bottleneck.options[b],
        `Language ${loc} missing translation for bottleneck: ${b}`
      );
    }
    for (const p of canonicalPartnerships) {
      assert.ok(
        formFields.partnership.options[p],
        `Language ${loc} missing translation for partnership: ${p}`
      );
    }
  }
});

test("no placeholder text exists in any dictionary", () => {
  const disallowedPatterns = [/lorem ipsum/i, /\btodo\b/i, /\btbd\b/i, /placeholder text/i];

  for (const loc of locales) {
    const dict = getDictionary(loc);
    const serialized = JSON.stringify(dict);
    for (const pattern of disallowedPatterns) {
      assert.equal(
        pattern.test(serialized),
        false,
        `Dictionary ${loc} contains placeholder matching ${pattern}`
      );
    }
  }
});
