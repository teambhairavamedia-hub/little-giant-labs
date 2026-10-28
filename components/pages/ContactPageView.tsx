"use client";

import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { DocumentIcon, HandshakeIcon, PinIcon, SearchIcon } from "@/components/ui/Icons";
import { siteConfig } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";

/* Apply → review → partner, drawn as a connected three-step pictograph. */
function ProcessPictograph() {
  const steps = [DocumentIcon, SearchIcon, HandshakeIcon];
  return (
    <div className="mt-10 flex items-center" aria-hidden="true">
      {steps.map((StepIcon, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && <span className="h-px w-8 border-t border-dashed border-[#C5A059]/60 sm:w-10" />}
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full border ${
              i === steps.length - 1
                ? "border-[#C5A059] bg-[#C5A059]/10 text-lgl-gold"
                : "border-lgl-line/30 text-lgl-sage"
            }`}
          >
            <StepIcon size={20} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* Contour field with a rising growth line */
function ContactHeroVisual() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="pointer-events-none -ml-3 mt-6 h-40 w-40 shrink-0 sm:h-48 sm:w-48 lg:mt-0 lg:h-[clamp(240px,22vw,320px)] lg:w-[clamp(240px,22vw,320px)]"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1" className="text-lgl-line/15">
        <circle cx="200" cy="200" r="190" strokeDasharray="2 8" />
        <circle cx="200" cy="200" r="150" />
        <circle cx="200" cy="200" r="110" />
        <circle cx="200" cy="200" r="70" />
      </g>
      <path
        d="M90,250 C150,250 170,150 230,150 S300,110 320,90"
        fill="none"
        stroke="#C5A059"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="320" cy="90" r="6" fill="#C5A059" />
      <circle cx="90" cy="250" r="4" className="fill-lgl-sage" />
      <circle cx="230" cy="150" r="4" className="fill-lgl-sage" />
    </svg>
  );
}

export function ContactPageView() {
  const { dict } = useI18n();

  return (
    <main className="min-h-screen bg-lgl-bg text-lgl-fg">
      <section className="relative overflow-hidden border-b border-lgl-line/20 bg-lgl-bg px-6 pb-16 pt-28 md:px-8 md:pb-20 md:pt-36 xl:pt-40">
        <Container className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div>
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[.28em] text-lgl-gold">
              {dict.contact.header.eyebrow} <span className="px-2 text-lgl-soft">/</span>{" "}
              {dict.contact.header.tagline}
            </p>
            <h1 className="max-w-4xl font-display text-5xl leading-[.98] tracking-[-.055em] text-lgl-fg sm:text-6xl md:text-7xl">
              {dict.contact.header.titlePart1}
              <br />
              <span className="text-lgl-sage">{dict.contact.header.titleEmphasis}</span>
            </h1>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-lgl-soft md:text-base">
              {dict.contact.header.description}
            </p>
          </div>
          <ContactHeroVisual />
        </Container>
      </section>

      <section className="bg-lgl-bg px-6 py-14 md:px-8 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <aside className="lg:sticky lg:top-12 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-lgl-gold">
                {dict.contact.sidebar.eyebrow}
              </p>
              <h2 className="mt-5 max-w-sm font-display text-3xl leading-[1.35] tracking-[-.04em] text-lgl-fg [word-spacing:0.17em]">
                {dict.contact.sidebar.title}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-lgl-soft">
                {dict.contact.sidebar.description}
              </p>
              <ProcessPictograph />
              <div className="mt-10 border-t border-lgl-line/30 pt-5 text-[11px] font-semibold uppercase tracking-[.22em] text-lgl-soft">
                {dict.contact.sidebar.tagline}
              </div>
              {/* Office address — opens in Google Maps */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address.full)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 flex max-w-sm items-start gap-4 rounded-2xl border border-lgl-line/30 p-5 transition-colors hover:border-lgl-gold/50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lgl-gold/30 text-lgl-gold">
                  <PinIcon size={17} />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[.22em] text-lgl-gold">
                    {dict.footer.officeHeading}
                  </span>
                  <address className="mt-2 text-sm not-italic leading-relaxed text-lgl-soft">
                    <span className="block font-semibold text-lgl-fg">{siteConfig.address.building}</span>
                    {siteConfig.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </span>
              </a>
            </aside>
            <ContactForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
