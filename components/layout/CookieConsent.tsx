"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { gaMeasurementId, metaPixelId } from "@/lib/analytics";
import { getConsent, setConsent, subscribeConsent, subscribeConsentOpen } from "@/lib/consent";

/* Cookie banner shown until the visitor chooses; reopened from the footer's "Cookie settings". Only shown when an
   analytics tool is configured, since without one the site sets no analytics cookies. English only for now. */
export function CookieConsent() {
  const choice = useSyncExternalStore(subscribeConsent, getConsent, () => "rejected" as const);
  const [reopened, setReopened] = useState(false);
  const hasTools = Boolean(gaMeasurementId() || metaPixelId());

  useEffect(() => subscribeConsentOpen(() => setReopened(true)), []);

  if (!hasTools || (choice && !reopened)) return null;

  const decide = (value: "accepted" | "rejected") => {
    setConsent(value);
    setReopened(false);
  };

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cookie-consent-title" className="cookie-consent">
      <p id="cookie-consent-title" className="font-display text-lg text-lgl-fg">Cookies on this website</p>
      <p className="mt-2 text-sm leading-relaxed text-lgl-soft">
        We would like to use analytics cookies to understand how visitors use our website and which campaigns bring
        enquiries. They are only set if you accept. See our{" "}
        <Link href="/privacy" className="text-lgl-gold underline underline-offset-4">Privacy Policy</Link>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="lgl-gold-cta inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-6 text-xs font-bold uppercase tracking-[.16em] transition-opacity hover:opacity-85"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide("rejected")}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-lgl-fg/25 px-6 text-xs font-bold uppercase tracking-[.16em] text-lgl-fg transition-colors hover:border-lgl-gold"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
