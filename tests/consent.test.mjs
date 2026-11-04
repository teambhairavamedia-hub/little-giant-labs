import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseConsent } from "../lib/consent.ts";

test("only an explicit accept or reject counts as a cookie choice", () => {
  assert.equal(parseConsent("accepted"), "accepted");
  assert.equal(parseConsent("rejected"), "rejected");
  for (const value of [null, undefined, "", "yes", "ACCEPTED", "true"]) assert.equal(parseConsent(value), null, String(value));
});

test("analytics scripts load only after the visitor accepts", async () => {
  const source = await readFile(new URL("../components/layout/Analytics.tsx", import.meta.url), "utf8");
  assert.match(source, /const allowed = consent === "accepted"/);
  assert.match(source, /\{allowed && gaId && \(/);
  assert.match(source, /\{allowed && pixelId && \(/);
  assert.match(source, /ga-disable-\$\{gaId\}/);
});
