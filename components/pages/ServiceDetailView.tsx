"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ServicePillarSection } from "@/components/pages/ServicesPageView";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";
import { servicePillars } from "@/lib/service-pillars";

/* One service on its own page (/services/brand-strategy …): the same section as on the Services page, with the
   service heading as the page heading, then links to the other services. */
export function ServiceDetailView({ index }: { index: number }) {
  const { dict, locale } = useI18n();
  const page = dict.servicesPage;
  const servicesHref = getLocalizedPath("/services", locale);

  return (
    <main className="services-page pt-24 md:pt-28 [&_:is(h1,h2,h3)]:[overflow-wrap:break-word]">
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-lgl-fg/70">
          <Link href={servicesHref} className="underline-offset-4 hover:text-lgl-fg hover:underline">
            {dict.nav.services}
          </Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page" className="text-lgl-fg">{page.items[index].label}</span>
        </nav>
      </Container>

      <ServicePillarSection index={index} headingLevel="h1" />

      <section className="border-b border-lgl-fg/10 py-12 md:py-18" style={{ background: "var(--lgl-bg)" }}>
        <Container>
          <p className="home-eyebrow">{page.jumpLabel}</p>
          <nav aria-label={page.jumpLabel} className="mt-6 flex flex-wrap gap-3">
            {page.items.map((item, i) =>
              i === index ? null : (
                <Link
                  key={servicePillars[i].slug}
                  href={`/services/${servicePillars[i].slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-lgl-fg/15 px-4 py-2 text-sm font-medium text-lgl-fg/80 transition-colors hover:border-lgl-gold/60 hover:text-lgl-fg"
                >
                  <span className="font-semibold text-lgl-gold">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </Container>
      </section>
    </main>
  );
}
