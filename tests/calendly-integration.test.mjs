import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  CALENDLY_BASE_URL,
  CALENDLY_PALETTE,
  buildCalendlyUrl,
} from "../lib/calendly.ts";

const projectRoot = path.resolve(import.meta.dirname, "..");

test("Calendly uses the updated booking URL", () => {
  assert.equal(
    CALENDLY_BASE_URL,
    "https://calendly.com/hello-littlegiantlabs/brand-strategy-discussion-meeting"
  );
});

test("Calendly palette is a single fixed palette", () => {
  assert.deepEqual(CALENDLY_PALETTE, {
    background_color: "162638",
    text_color: "f8f6f0",
    primary_color: "c5a059",
  });
});

test("buildCalendlyUrl always generates the fixed-palette URL", () => {
  const url = buildCalendlyUrl();
  const parsed = new URL(url);

  assert.equal(parsed.origin + parsed.pathname, CALENDLY_BASE_URL);
  assert.equal(parsed.searchParams.get("background_color"), "162638");
  assert.equal(parsed.searchParams.get("text_color"), "f8f6f0");
  assert.equal(parsed.searchParams.get("primary_color"), "c5a059");
});

test("buildCalendlyUrl is theme-independent and deterministic", () => {
  assert.equal(buildCalendlyUrl(), buildCalendlyUrl());
  assert.equal(buildCalendlyUrl.length, 0);
});

test("CalendlyWidget component source implements auto-resize, dynamic height, deduplication, and cleanup", () => {
  const widgetSource = fs.readFileSync(
    path.join(projectRoot, "components/contact/CalendlyWidget.tsx"),
    "utf8"
  );

  assert.ok(
    widgetSource.includes('id="calendly-widget-script"'),
    "Next Script must have id='calendly-widget-script'"
  );
  assert.ok(
    widgetSource.includes('strategy="afterInteractive"'),
    "Next Script must have strategy='afterInteractive'"
  );
  assert.ok(
    widgetSource.includes("subscribeColorTheme"),
    "Component must use subscribeColorTheme"
  );
  assert.ok(
    widgetSource.includes("getColorTheme"),
    "Component must use getColorTheme"
  );
  assert.ok(
    widgetSource.includes("window.Calendly.initInlineWidget"),
    "Component must initialize widget via window.Calendly.initInlineWidget"
  );
  assert.ok(
    widgetSource.includes("resize: true"),
    "Component must pass resize: true to Calendly.initInlineWidget"
  );
  assert.ok(
    widgetSource.includes('data-resize="true"'),
    "Widget container must have data-resize='true'"
  );
  assert.ok(
    widgetSource.includes("calendly.page_height"),
    "Component must listen for calendly.page_height postMessage events"
  );
  assert.ok(
    widgetSource.includes('innerHTML = ""'),
    "Component must clear innerHTML to prevent duplicate widget instances"
  );
  assert.ok(
    widgetSource.includes("max-w-xl"),
    "Layout must keep its existing max-width constraint"
  );
  assert.ok(
    widgetSource.includes('minWidth: "320px"') || widgetSource.includes('min-width: 320px'),
    "Widget must specify 320px minimum width"
  );
  assert.ok(
    widgetSource.includes('height: widgetHeight'),
    "Widget must dynamically apply widgetHeight"
  );
  assert.ok(
    widgetSource.includes("buildCalendlyUrl()"),
    "Component must call buildCalendlyUrl without a theme argument"
  );
  assert.ok(
    !widgetSource.includes("CALENDLY_THEME_CONFIG"),
    "Component must not reference the obsolete CALENDLY_THEME_CONFIG"
  );
  assert.ok(
    widgetSource.includes("data-theme={theme}"),
    "Outer container must keep its theme-responsive styling"
  );
  assert.ok(
    widgetSource.includes("calendly.date_and_time_selected"),
    "Component must preserve the booking-progress safeguard"
  );
});

test("ApplicationReceivedPageView hosts CalendlyWidget after confirmation content", () => {
  const pageViewSource = fs.readFileSync(
    path.join(projectRoot, "components/pages/ApplicationReceivedPageView.tsx"),
    "utf8"
  );

  assert.ok(
    pageViewSource.includes("<CalendlyWidget />") || pageViewSource.includes("<CalendlyWidget"),
    "ApplicationReceivedPageView must render CalendlyWidget"
  );
  assert.ok(
    pageViewSource.includes("dict.applicationReceived.headlinePart1"),
    "Confirmation headline must be preserved"
  );
  assert.ok(
    pageViewSource.includes("dict.applicationReceived.body1"),
    "Confirmation body1 must be preserved"
  );
  assert.ok(
    pageViewSource.includes("dict.applicationReceived.body2"),
    "Confirmation body2 must be preserved"
  );
  assert.ok(
    pageViewSource.includes("dict.applicationReceived.returnHome"),
    "Return home link must be preserved"
  );
});

test("ContactForm navigates to /application-received only after successful backend response", () => {
  const formSource = fs.readFileSync(
    path.join(projectRoot, "components/contact/ContactForm.tsx"),
    "utf8"
  );

  const postIndex = formSource.indexOf('fetch("/api/applications"');
  const responseOkIndex = formSource.indexOf("if (!response.ok)", postIndex);
  const routerPushIndex = formSource.indexOf('router.push(getLocalizedPath("/application-received"', responseOkIndex);

  assert.ok(postIndex > 0, "Form posts to /api/applications");
  assert.ok(responseOkIndex > postIndex, "Form validates response.ok");
  assert.ok(routerPushIndex > responseOkIndex, "Router navigates to /application-received only after response.ok check");
});
