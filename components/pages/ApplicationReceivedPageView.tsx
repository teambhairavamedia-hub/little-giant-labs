"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";

export function ApplicationReceivedPageView() {
  const { dict, locale } = useI18n();
  const homePath = getLocalizedPath("/", locale);

  return (
    <main className="flex min-h-[75vh] items-center bg-lgl-bg py-24 text-lgl-fg">
      <Container className="w-full">
        <div className="mx-auto max-w-3xl border-l border-[#C5A059] py-4 pl-7 sm:pl-12">
          <svg viewBox="0 0 96 96" className="mb-8 h-20 w-20" aria-hidden="true" focusable="false">
            <circle cx="48" cy="48" r="46" fill="none" stroke="#C5A059" strokeOpacity=".3" strokeDasharray="2 6" />
            <circle cx="48" cy="48" r="36" fill="rgba(197,160,89,.1)" stroke="#C5A059" strokeWidth="1.5" />
            <path
              d="M33 49 L44 60 L64 38"
              fill="none"
              stroke="#C5A059"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-[11px] font-semibold uppercase tracking-[.28em] text-lgl-gold">
            {dict.applicationReceived.eyebrow}
          </p>
          <h1 className="mt-7 font-display text-5xl leading-[1.02] tracking-[-.055em] sm:text-7xl">
            {dict.applicationReceived.headlinePart1}
            <br />
            <span className="text-lgl-sage">{dict.applicationReceived.headlineEmphasis}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-lgl-soft">
            {dict.applicationReceived.body1}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-lgl-soft">
            {dict.applicationReceived.body2}
          </p>
          <p className="mt-12 text-[11px] font-semibold uppercase tracking-[.24em] text-lgl-gold">
            {dict.applicationReceived.tagline}
          </p>
          <Link
            href={homePath}
            className="mt-10 inline-flex min-h-12 items-center border border-lgl-line px-6 text-xs font-semibold uppercase tracking-[.16em] text-lgl-fg transition-colors hover:border-[#C5A059] hover:text-lgl-gold"
          >
            {dict.applicationReceived.returnHome}
          </Link>
        </div>
      </Container>
    </main>
  );
}
