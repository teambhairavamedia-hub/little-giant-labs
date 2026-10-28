"use client";

import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { DocumentIcon, HandshakeIcon, SearchIcon } from "@/components/ui/Icons";
import { accentTitle } from "@/components/ui/accentTitle";
import { useI18n } from "@/lib/i18n/context";

/* "What happens next": tell us → we review → we connect, as a connected vertical timeline. */
function NextSteps({ label, steps }: { label: string; steps: readonly string[] }) {
  const icons = [DocumentIcon, SearchIcon, HandshakeIcon];
  return (
    <div className="mt-10">
      <p className="text-[11px] font-semibold uppercase tracking-[.24em] text-lgl-gold">{label}</p>
      <ol className="mt-6 space-y-0">
        {steps.map((step, i) => {
          const StepIcon = icons[i % icons.length];
          const last = i === steps.length - 1;
          return (
            <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
              {!last && (
                <span aria-hidden="true" className="absolute left-6 top-12 bottom-0 border-l border-dashed border-[#C5A059]/50" />
              )}
              <span
                aria-hidden="true"
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
                  last ? "border-[#C5A059] bg-[#C5A059]/10 text-lgl-gold" : "border-lgl-line/30 text-lgl-sage"
                }`}
              >
                <StepIcon size={20} />
              </span>
              <p className="pt-3 text-sm leading-relaxed text-lgl-fg/85">
                <span className="mr-1.5 font-semibold text-lgl-gold">{i + 1}.</span>
                {step}
              </p>
            </li>
          );
        })}
      </ol>
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
              {dict.contact.header.eyebrow}
            </p>
            <h1 className="max-w-4xl text-balance font-display text-5xl leading-[.98] tracking-[-.055em] text-lgl-fg sm:text-6xl md:text-7xl">
              {accentTitle(dict.contact.header.title)}
            </h1>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-lgl-soft md:text-base">
              {dict.contact.header.description}
            </p>
          </div>
          <ContactHeroVisual />
        </Container>
      </section>

      <section className="bg-lgl-bg px-6 py-14 md:px-8 md:pb-12 md:pt-20">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <aside className="lg:sticky lg:top-12 lg:self-start">
              <p className="max-w-sm text-base leading-relaxed text-lgl-soft">{dict.contact.sidebar.intro}</p>
              <NextSteps label={dict.contact.sidebar.stepsLabel} steps={dict.contact.sidebar.steps} />
              <div className="mt-10 border-t border-lgl-line/30 pt-5 text-[11px] font-semibold uppercase tracking-[.22em] text-lgl-soft">
                {dict.contact.sidebar.tagline}
              </div>
              {/* The office address lives in the footer only */}
            </aside>
            <ContactForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
