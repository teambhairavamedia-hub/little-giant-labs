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

test("consultation role, help and timeline options are translated in every locale", () => {
  const roles = ["Founder / Owner", "Executive / Leadership", "Marketing / Brand", "People / Talent", "Product / Operations", "Other"];
  const help = ["Brand strategy & positioning", "Creative & content", "Digital marketing & growth", "Employer brand & talent communication", "Not sure yet / help me decide"];
  const timelines = ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Flexible / not decided"];
  for (const loc of locales) {
    const dict = getDictionary(loc);
    const formFields = dict.contact.form.fields;
    for (const option of roles) assert.ok(formFields.role.options[option], `Language ${loc} missing role: ${option}`);
    for (const option of help) assert.ok(formFields.helpWith.options[option], `Language ${loc} missing help: ${option}`);
    for (const option of timelines) assert.ok(formFields.timeline.options[option], `Language ${loc} missing timeline: ${option}`);
    assert.equal(formFields.timeline.label, loc === "en" ? "Approximate timeline" : formFields.timeline.label);
    assert.equal(formFields.projectDetails.label.length > 0, true);
    assert.deepEqual(formFields ? Object.keys(formFields) : [], ["contactName", "workEmail", "companyName", "role", "helpWith", "projectDetails", "timeline"]);
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

test("home SEO title is Little Giant Labs and subpage titles do not duplicate brand template", () => {
  for (const loc of locales) {
    const dict = getDictionary(loc);
    // Home title should be exactly the brand name
    assert.equal(dict.seo.home.title, "Little Giant Labs");

    // Subpage titles should not include "| Little Giant Labs" to avoid template duplication
    for (const page of ["about", "contact", "work", "applicationReceived"]) {
      assert.equal(
        dict.seo[page].title.includes("| Little Giant Labs"),
        false,
        `Subpage ${page} in locale ${loc} should not contain "| Little Giant Labs"`
      );
    }
  }
});

