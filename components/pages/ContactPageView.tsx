"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { CompassIcon, DocumentIcon, HandshakeIcon, PenToolIcon, SearchIcon, TrendIcon } from "@/components/ui/Icons";
import { accentTitle } from "@/components/ui/accentTitle";
import { useI18n } from "@/lib/i18n/context";

/* "What happens next": tell us → we review → we connect, as a connected vertical timeline. */
function NextSteps({ label, steps }: { label: string; steps: readonly string[] }) {
  const icons = [DocumentIcon, SearchIcon, HandshakeIcon];
  return (
    <div className="mt-10">
      <p className="home-eyebrow">{label}</p>
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
              <p className="flex min-h-12 items-center text-sm leading-relaxed text-lgl-fg/85">{step}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const topicIcons = [CompassIcon, PenToolIcon, TrendIcon];

/* Hero artwork: a dart on target (decorative; the headline carries the meaning). Transparent PNG, so it sits on
   the page in both themes. */
function ContactHeroVisual() {
  return (
    <figure className="contact-visual" aria-hidden="true">
      <Image
        src="/media/contact/contact-dart.png"
        alt=""
        width={1433}
        height={1259}
        priority
        sizes="(max-width: 1023px) 160px, 300px"
        className="h-full w-full object-contain"
      />
    </figure>
  );
}

export function ContactPageView() {
  const { dict } = useI18n();

  return (
    <main className="min-h-screen bg-lgl-bg text-lgl-fg">
      <section className="contact-hero relative overflow-hidden border-b border-lgl-line/20 pb-8 pt-28 md:pb-10 md:pt-34">
        <Container className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="home-eyebrow" style={{ marginBottom: "1rem" }}>{dict.contact.header.eyebrow}</p>
            <h1 className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] tracking-[-.045em] text-lgl-fg">
              {accentTitle(dict.contact.header.title)}
            </h1>
            <p className="mt-5 max-w-xl border-l-2 border-lgl-gold/55 pl-5 text-base leading-relaxed text-lgl-soft md:text-lg">
              {dict.contact.header.description}
            </p>
            {/* What we can talk about: the brand's three disciplines (the localized footer slogan) */}
            <ul className="mt-6 flex flex-wrap gap-3">
              {dict.footer.slogan.split(/\s*·\s*/).map((topic, index) => {
                const TopicIcon = topicIcons[index % topicIcons.length];
                return (
                  <li key={topic} className="contact-topic">
                    <span className="lgl-icon-badge h-8 w-8">
                      <TopicIcon size={15} />
                    </span>
                    {topic}
                  </li>
                );
              })}
            </ul>
          </div>
          <ContactHeroVisual />
        </Container>
      </section>

      <section className="bg-lgl-bg pb-12 pt-6 md:pb-18 md:pt-8">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <aside className="order-2 lg:order-none lg:sticky lg:top-12 lg:self-start">
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
