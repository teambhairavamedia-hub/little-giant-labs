"use client";

import { type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CheckIcon } from "@/components/ui/Icons";
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
          <div className="max-w-3xl">
            <p className="label-eyebrow flex items-center gap-3 text-lgl-gold">
              <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-lgl-gold to-lgl-gold/0" />
              {intro.eyebrow}
            </p>
            <h1 className={`mt-5 ${headingClass}`} style={headingFont}>
              {intro.titlePart1}
              <span className="font-normal italic text-lgl-sage" style={{ fontFamily: "Georgia, serif" }}>
                {intro.titleEmphasis}
              </span>
            </h1>
            <p className="mt-6 text-base leading-[1.8] text-lgl-fg/75 md:text-lg">{intro.subheading}</p>
          </div>
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
            id={pillar.slug}
            theme="light"
            className="scroll-mt-28 border-b border-lgl-fg/10 py-16 md:py-24"
            style={{ background: index % 2 === 0 ? "var(--lgl-section)" : "var(--lgl-bg)" }}
          >
            <Container>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                  <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-3xl border border-lgl-fg/10 bg-lgl-fg/5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] lg:sticky lg:top-36">
                    <Image
                      src={pillar.image}
                      alt={dict.home.whatWeDo.items[index]?.alt ?? item.label}
                      width={640}
                      height={800}
                      sizes="(max-width: 1024px) 92vw, 540px"
                      className="h-full w-full object-cover"
                    />
                  </figure>
                </div>

                <div>
                  <p className="label-eyebrow flex items-center gap-3 text-lgl-gold">
                    <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-lgl-gold to-lgl-gold/0" />
                    {number} / {item.label}
                  </p>
                  <h2 className={`mt-5 ${headingClass}`} style={headingFont}>
                    {item.title}
                  </h2>
                  <p className="mt-6 text-base leading-[1.8] text-lgl-fg/75 md:text-lg">{item.intro}</p>

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

                  <div className="mt-10 grid gap-5 md:grid-cols-2">
                    <Card className="p-6 md:p-7">
                      <p className="label-eyebrow text-lgl-gold">{page.outcomeLabel}</p>
                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-lgl-fg/80">{item.outcome}</p>
                    </Card>
                    <Card className="p-6 md:p-7">
                      <p className="label-eyebrow text-lgl-gold">{page.fitLabel}</p>
                      <p className="mt-3 text-[0.9375rem] leading-relaxed text-lgl-fg/80">{item.fit}</p>
                    </Card>
                  </div>

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
    </main>
  );
}
