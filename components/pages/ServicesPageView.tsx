"use client";

import { type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { accentTitle } from "@/components/ui/accentTitle";
import { CheckIcon, CompassIcon } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";
import { servicePillars } from "@/lib/service-pillars";

/* Shared with the About page: gold pill CTA and heading font */
const pillBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300";
const pillFont: CSSProperties = { fontFamily: "var(--font-dm-sans), sans-serif" };
const headingFont: CSSProperties = { fontFamily: "var(--font-manrope), sans-serif" };
const headingClass =
  "text-balance text-[clamp(1.875rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-lgl-fg";

export function ServicesPageView() {
  const { dict, locale } = useI18n();
  const page = dict.servicesPage;
  const { capabilities } = page;
  const intro = dict.home.whatWeDo;
  const contactHref = getLocalizedPath("/contact", locale);

  return (
    <main className="services-page [&_:is(h1,h2,h3)]:[overflow-wrap:break-word]">
      {/* ── Header: shared "What we do" statement + jump links to each service ── */}
      <Section
        theme="light"
        className="border-b border-lgl-fg/10 pt-28 md:pt-32 xl:pt-40"
        style={{ background: "var(--lgl-bg)" }}
      >
        <Container className="py-12 md:py-20">
          {/* Title and pull quote on the left, intro beside them on a gold rule (as on the homepage) */}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <div>
              <p className="home-eyebrow">
                {intro.eyebrow}
              </p>
              <h1 className={`mt-5 ${headingClass}`} style={headingFont}>
                {accentTitle(page.heading)}
              </h1>
              <blockquote className="mt-6 max-w-2xl">
                <p
                  className="text-lg italic leading-[1.6] text-lgl-fg/85 md:text-xl"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {page.quote}
                </p>
              </blockquote>
            </div>
            <p className="border-l-2 border-lgl-gold/55 pl-5 text-base leading-[1.8] text-lgl-fg/75 md:text-lg lg:mb-1">
              {page.intro}
            </p>
          </div>
          {/* Approach statement, before the jump links to the pillars */}
          <Card className="group relative mt-10 flex flex-col gap-5 overflow-hidden p-6 sm:flex-row sm:items-center md:mt-14 md:gap-7 md:p-8">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-lgl-gold via-lgl-gold/40 to-lgl-gold/0" />
            <span className="lgl-icon-badge h-12 w-12">
              <CompassIcon size={22} />
            </span>
            <p className="text-base leading-[1.8] text-lgl-fg md:text-lg">{page.approach}</p>
          </Card>
          <nav aria-label={page.jumpLabel} className="mt-10 flex flex-wrap gap-3">
            {page.items.map((item, index) => (
              <a
                key={item.label}
                href={`#${servicePillars[index].slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-lgl-fg/15 px-4 py-2 text-sm font-medium text-lgl-fg/80 transition-colors hover:border-lgl-gold/60 hover:text-lgl-fg"
              >
                <span className="font-semibold text-lgl-gold">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </Container>
      </Section>

      {/* ── One section per service; image side alternates on desktop ── */}
      {page.items.map((item, index) => {
        const pillar = servicePillars[index];
        const number = String(index + 1).padStart(2, "0");
        return (
          <Section
            key={pillar.slug}
            theme="light"
            className="border-b border-lgl-fg/10 py-16 md:py-24"
            style={{ background: index % 2 === 0 ? "var(--lgl-section)" : "var(--lgl-bg)" }}
          >
            <Container>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                  <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-3xl border border-lgl-fg/10 bg-lgl-fg/5 lg:sticky lg:top-36">
                    <Image
                      src={pillar.image}
                      alt={dict.home.whatWeDo.items[index]?.alt ?? item.label}
                      width={pillar.width}
                      height={pillar.height}
                      sizes="(max-width: 1024px) 92vw, 540px"
                      style={{ objectPosition: pillar.focus }}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                </div>

                {/* Link target: jump links and homepage links land on this heading, just below the fixed header */}
                <div id={pillar.slug} className="scroll-mt-32">
                  <p className="home-eyebrow">
                    <b className="font-bold">{number}</b>
                    {item.label}
                  </p>
                  <h2 className={`mt-5 ${headingClass}`} style={headingFont}>
                    {accentTitle(item.title)}
                  </h2>
                  <div className="mt-6 space-y-4 text-base leading-[1.8] text-lgl-fg/75 md:text-lg">
                    {item.intro.split("\n\n").map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  <h3 className="mt-10 text-lg font-bold tracking-tight text-lgl-fg" style={headingFont}>
                    {page.helpLabel}
                  </h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {item.help.map((help) => (
                      <li key={help} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-lgl-fg/75">
                        <CheckIcon size={14} strokeWidth={2} className="mt-1 shrink-0 text-lgl-gold" />
                        {help}
                      </li>
                    ))}
                  </ul>

                  {(item.outcome || item.fit) && (
                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                      {item.outcome && (
                        <Card className="p-6 md:p-7">
                          <p className="label-eyebrow text-lgl-gold">{page.outcomeLabel}</p>
                          <p className="mt-3 text-[0.9375rem] leading-relaxed text-lgl-fg/80">{item.outcome}</p>
                        </Card>
                      )}
                      {item.fit && (
                        <Card className="p-6 md:p-7">
                          <p className="label-eyebrow text-lgl-gold">{page.fitLabel}</p>
                          <p className="mt-3 text-[0.9375rem] leading-relaxed text-lgl-fg/80">{item.fit}</p>
                        </Card>
                      )}
                    </div>
                  )}

                  <Link href={contactHref} className={`lgl-gold-cta ${pillBase} mt-10 hover:opacity-85`} style={pillFont}>
                    {item.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </Container>
          </Section>
        );
      })}

      {/* ── Capabilities overview (moved from the About page) ── */}
      <Section
        id="capabilities"
        theme="light"
        className="scroll-mt-28 py-16 md:py-24"
        style={{ background: page.items.length % 2 === 0 ? "var(--lgl-section)" : "var(--lgl-bg)" }}
      >
        <Container>
          <div className="max-w-3xl">
            <p className="home-eyebrow">
              {capabilities.eyebrow}
            </p>
            <h2 className={`mt-5 ${headingClass}`} style={headingFont}>
              {accentTitle(capabilities.lead)}
            </h2>
          </div>
          <div className="mt-8 max-w-4xl space-y-5 text-base leading-[1.8] text-lgl-fg/75">
            {capabilities.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-12 md:mt-16">
            <ServiceGrid />
          </div>
        </Container>
      </Section>
    </main>
  );
}
