import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_PHONE_COUNTRY, PHONE_COUNTRIES, parseE164, toE164 } from "../lib/phone.ts";

test("country list defaults to India and has one entry per country", () => {
  assert.equal(DEFAULT_PHONE_COUNTRY, "IN");
  assert.equal(PHONE_COUNTRIES.find((country) => country.iso === "IN")?.dial, "91");
  const isos = PHONE_COUNTRIES.map((country) => country.iso);
  assert.equal(new Set(isos).size, isos.length);
  assert.ok(PHONE_COUNTRIES.length > 200);
  for (const { iso, dial } of PHONE_COUNTRIES) {
    assert.match(iso, /^[A-Z]{2}$/);
    assert.match(dial, /^[1-9]\d{0,2}$/);
  }
});

test("distinct calling codes are prefix-free, so a number matches at most one", () => {
  const codes = [...new Set(PHONE_COUNTRIES.map((country) => country.dial))];
  for (const a of codes) for (const b of codes) {
    if (a !== b) assert.equal(b.startsWith(a), false, `${a} is a prefix of ${b}`);
  }
});

test("Indian numbers: ten digits, with spacing, a trunk 0 or a typed +91 accepted", () => {
  for (const typed of ["98765 43210", "9876543210", "098765-43210", "+91 98765 43210", "0091 9876543210", "(987) 654-3210"]) {
    assert.equal(toE164("IN", typed), "+919876543210", typed);
  }
  for (const typed of ["98765", "98765432101", "98765abcde", "", "+91 12345"]) {
    assert.equal(toE164("IN", typed), null, typed);
  }
});

test("international numbers are accepted for their country code", () => {
  assert.equal(toE164("US", "(415) 555-2671"), "+14155552671");
  assert.equal(toE164("GB", "020 7946 0958"), "+442079460958");
  assert.equal(toE164("AE", "50 123 4567"), "+971501234567");
  assert.equal(toE164("SG", "8123 4567"), "+6581234567");
  assert.equal(toE164("DE", "030 1234567"), "+49301234567");
  assert.equal(toE164("AU", "0412 345 678"), "+61412345678");
  // Italian landlines keep their leading 0
  assert.equal(toE164("IT", "06 1234 5678"), "+390612345678");
});

test("unknown codes, impossible lengths and unknown countries are rejected", () => {
  assert.equal(toE164("ZZ", "12345678"), null);
  assert.equal(toE164("US", "1234"), null);
  assert.equal(toE164("US", "1".repeat(16)), null);
  assert.equal(parseE164("+999123456789"), null);
  assert.equal(parseE164("919876543210"), null);
  assert.equal(parseE164("+0919876543210"), null);
  assert.deepEqual(parseE164("+919876543210"), { dial: "91", national: "9876543210" });
});
