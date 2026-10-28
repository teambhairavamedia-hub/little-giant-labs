"use client";

import { type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import {
  ChartIcon,
  CompassIcon,
  GlobeIcon,
  LayersIcon,
  MailIcon,
  PenToolIcon,
  SearchIcon,
  SparkIcon,
} from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";

const valueIcons = [SearchIcon, CompassIcon, LayersIcon, ChartIcon];
const stepIcons = [SearchIcon, CompassIcon, PenToolIcon, GlobeIcon];
const stageIcons = [SparkIcon, ChartIcon, LayersIcon];

const easeOut = [0.22, 1, 0.36, 1] as const;

/* Shared pill-button styles (gold primary matches the header CTA) */
const pillBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300";
const pillFont: CSSProperties = { fontFamily: "var(--font-dm-sans), sans-serif" };
const headingFont: CSSProperties = { fontFamily: "var(--font-manrope), sans-serif" };

/* Header illustration */
function AboutHeaderVisual() {
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1" className="text-lgl-line/20">
        <circle cx="160" cy="160" r="150" strokeDasharray="2 8" />
        <circle cx="160" cy="160" r="112" />
        <circle cx="160" cy="160" r="74" />
        <path d="M160,10 V48 M160,272 V310 M10,160 H48 M272,160 H310" />
      </g>
      <circle
        cx="160"
        cy="160"
        r="112"
        fill="none"
        stroke="#C5A059"
        strokeWidth="1.5"
        strokeDasharray="120 584"
        strokeLinecap="round"
        opacity=".8"
      />
      <path
        d="M104,196 L140,168 L166,182 L216,126"
        fill="none"
        stroke="#C5A059"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M196,124 H218 V146"
        fill="none"
        stroke="#C5A059"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g className="fill-lgl-sage">
        <circle cx="104" cy="196" r="4" />
        <circle cx="140" cy="168" r="4" />
        <circle cx="166" cy="182" r="4" />
      </g>
      <circle cx="270" cy="62" r="5" fill="#C5A059" />
    </svg>
  );
}

/* Two-sentence titles: the first sentence stays bold, the rest takes the serif-italic sage accent.
   Splits on the first "." or "।" followed by a space; single-sentence titles render unchanged. */
function accentTitle(title: string): ReactNode {
  const match = /[.।]\s/.exec(title);
  if (!match) return title;
  return (
    <>
      {title.slice(0, match.index + 1)}{" "}
      <span className="font-normal italic text-lgl-sage" style={{ fontFamily: "Georgia, serif" }}>
        {title.slice(match.index + 2)}
      </span>
    </>
  );
}

/* Gold-rule eyebrow + section title */
function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className={`label-eyebrow flex items-center gap-3 text-lgl-gold ${centered ? "justify-center" : ""}`}>
        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-lgl-gold to-lgl-gold/0" />
        {eyebrow}
      </p>
      {title && (
        <h2
          className="mt-5 text-balance text-[clamp(1.875rem,4.4vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.04em] text-lgl-fg"
          style={headingFont}
        >
          {title}
        </h2>
      )}
    </div>
  );
}

export function AboutPageView() {
  const { dict, locale } = useI18n();
  const reduceMotion = useReducedMotion();
  const { header, story, purpose, capabilities, approach, engagement, principles, cta } = dict.about;
  const contactHref = getLocalizedPath("/contact", locale);


  /* Scroll-reveal for content blocks; disabled entirely for reduced-motion users */
  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: easeOut },
        };

  return (
    <main className="[&_:is(h1,h2,h3)]:[overflow-wrap:break-word]">
      {/* ── Hero: centred statement over a faded growth illustration ── */}
      <Section
        theme="light"
        className="relative overflow-hidden border-b border-lgl-fg/10 pt-28 md:pt-32 xl:pt-40"
        style={{ background: "var(--lgl-bg)" }}
      >
        <Container className="relative py-16 md:py-24">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(280px,42vw,520px)] w-[clamp(280px,42vw,520px)] -translate-x-1/2 -translate-y-1/2 opacity-20"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1, ease: easeOut }}
          >
            <AboutHeaderVisual />
          </motion.div>
          <motion.div
            className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <span aria-hidden="true" className="h-0.5 w-16 rounded-full bg-gradient-to-r from-lgl-gold/0 via-lgl-gold to-lgl-gold/0" />
            {/* Serif italic with a fg → gold sweep, echoing the homepage hero's "Brands" accent */}
            <h1
              className="mt-7 max-w-[20ch] text-balance bg-[linear-gradient(100deg,var(--lgl-fg)_30%,var(--lgl-gold)_100%)] bg-clip-text pb-1 pr-[0.08em] text-[1.875rem] font-normal italic leading-[1.2] tracking-[-0.015em] text-transparent [box-decoration-break:clone] sm:text-[2.375rem] md:text-[2.875rem] lg:text-[3.375rem]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {header.description}
            </h1>
            <a href="#services" className={`lgl-gold-cta ${pillBase} mt-9 hover:opacity-85`} style={pillFont}>
              {header.secondaryCta}
              <span aria-hidden="true">↓</span>
            </a>
          </motion.div>
        </Container>
      </Section>

      {/* ── Our story ────────────────────────────────────────────── */}
      <Section
        theme="light"
        className="border-b border-lgl-fg/10 py-16 md:py-24"
        style={{ background: "var(--lgl-section)", color: "var(--lgl-fg)" }}
      >
        <Container>
          <motion.div {...reveal()} className="mx-auto max-w-4xl">
            <SectionHeading eyebrow={story.eyebrow} />
            <div className="mt-8 space-y-6 text-base leading-[1.8] text-lgl-fg/75 md:text-lg">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <ul className="space-y-1">
                {story.facts.map((fact) => (
                  <li key={fact.label}>
                    <span className="font-semibold text-lgl-fg">{fact.label}:</span> {fact.value}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* ── Mission & belief ─────────────────────────────────────── */}
      <Section theme="light" className="py-16 md:py-24" style={{ background: "var(--lgl-bg)" }}>
        <Container>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <motion.div {...reveal()}>
              <Card className="group flex h-full flex-col p-8 transition-all duration-300 hover:border-lgl-gold/40 md:p-10 motion-safe:hover:-translate-y-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-lgl-gold/35 bg-lgl-gold/10 text-lgl-gold">
                  <CompassIcon size={22} />
                </span>
                <p className="label-eyebrow mt-7 text-lgl-gold">{purpose.missionLabel}</p>
                <p className="mt-4 text-lg leading-[1.7] text-lgl-fg md:text-xl">
                  {purpose.mission}
                </p>
              </Card>
            </motion.div>
            <motion.div {...reveal(0.1)}>
              <Card className="group flex h-full flex-col p-8 transition-all duration-300 hover:border-lgl-gold/40 md:p-10 motion-safe:hover:-translate-y-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-lgl-gold/35 bg-lgl-gold/10 text-lgl-gold">
                  <SparkIcon size={22} />
                </span>
                <p className="label-eyebrow mt-7 text-lgl-gold">{purpose.beliefLabel}</p>
                <p className="mt-4 text-lg leading-[1.7] text-lgl-fg md:text-xl">
                  {purpose.belief}
                </p>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ── Services ─────────────────────────────────────────────── */}
      <Section
        id="services"
        theme="light"
        className="scroll-mt-28 border-y border-lgl-fg/10 py-16 md:py-24"
        style={{ background: "var(--lgl-section)" }}
      >
        <Container>
          <motion.div {...reveal()}>
            <SectionHeading eyebrow={capabilities.eyebrow} title={capabilities.lead} />
            <div className="mt-8 grid gap-6 text-justify text-base leading-[1.8] text-lgl-fg/75 [hyphens:auto] lg:grid-cols-3 lg:gap-10">
              {capabilities.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
          <div className="mt-12 md:mt-16">
            <ServiceGrid />
          </div>
        </Container>
      </Section>

      {/* ── How we work ──────────────────────────────────────────── */}
      <Section theme="light" className="py-16 md:py-24" style={{ background: "var(--lgl-bg)" }}>
        <Container>
          {/* Centred: heading, lead paragraph, gold divider, supporting paragraphs */}
          <motion.div {...reveal()} className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <SectionHeading eyebrow={approach.eyebrow} title={accentTitle(approach.title)} align="center" />
            <p className="mt-8 text-lg leading-[1.7] text-lgl-fg md:text-xl">{approach.paragraphs[0]}</p>
            {approach.paragraphs.length > 1 && (
              <>
                <span aria-hidden="true" className="mt-8 h-0.5 w-16 rounded-full bg-gradient-to-r from-lgl-gold/0 via-lgl-gold to-lgl-gold/0" />
                <div className="mt-8 max-w-2xl space-y-4 text-base leading-[1.8] text-lgl-fg/70">
                  {approach.paragraphs.slice(1).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Understand → position → create → activate & learn */}
          <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-6">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[12%] top-[2.75rem] hidden h-px bg-gradient-to-r from-lgl-gold/0 via-lgl-gold/45 to-lgl-gold/0 lg:block"
            />
            {approach.steps.map((step, index) => {
              const StepIcon = stepIcons[index % stepIcons.length];
              return (
                <motion.li key={step.title} {...reveal(index * 0.08)} className="relative">
                  <Card className="flex h-full flex-col p-7 transition-all duration-300 hover:border-lgl-gold/40 motion-safe:hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-lgl-gold/40 bg-lgl-bg text-lgl-gold">
                        <StepIcon size={20} />
                      </span>
                      <span className="text-sm font-semibold tracking-[0.12em] text-lgl-fg/45">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg font-bold tracking-tight text-lgl-fg" style={headingFont}>
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-lgl-fg/70">{step.description}</p>
                  </Card>
                </motion.li>
              );
            })}
          </ol>
        </Container>
      </Section>

      {/* ── Engagement options ───────────────────────────────────── */}
      <Section
        theme="light"
        className="border-y border-lgl-fg/10 py-16 md:py-24"
        style={{ background: "var(--lgl-section)" }}
      >
        <Container>
          <motion.div {...reveal()} className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <SectionHeading eyebrow={engagement.eyebrow} title={engagement.title} />
            <p className="text-base leading-[1.8] text-lgl-fg/75 md:text-lg">{engagement.description}</p>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {engagement.options.map((option, index) => {
              const StageIcon = stageIcons[index % stageIcons.length];
              return (
                <motion.div key={option.title} {...reveal(index * 0.08)}>
                  <Card className="relative flex h-full flex-col overflow-hidden p-8 transition-all duration-300 hover:border-lgl-gold/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] motion-safe:hover:-translate-y-1">
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-lgl-gold via-lgl-gold/40 to-lgl-gold/0" />
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-lgl-gold/40 bg-lgl-gold/10 text-lgl-gold">
                      <StageIcon size={20} />
                    </span>
                    <h3 className="mt-6 text-lg font-bold tracking-tight text-lgl-fg" style={headingFont}>
                      {option.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-lgl-fg/70">{option.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── Principles ───────────────────────────────────────────── */}
      <Section theme="light" className="py-16 md:py-24" style={{ background: "var(--lgl-bg)" }}>
        <Container>
          <div>
            <motion.div {...reveal()}>
              <SectionHeading
                eyebrow={principles.eyebrow}
                align="center"
                title={
                  <>
                    {principles.titlePart1}{" "}
                    <span className="font-normal italic text-lgl-sage" style={{ fontFamily: "Georgia, serif" }}>
                      {principles.titleItalic}
                    </span>
                  </>
                }
              />
            </motion.div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {principles.values.map((value, index) => {
                const ValueIcon = valueIcons[index % valueIcons.length];
                return (
                  <motion.div key={value.title} {...reveal(index * 0.08)}>
                    <Card className="flex h-full flex-col p-8 transition-all duration-300 hover:border-lgl-gold/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] motion-safe:hover:-translate-y-1">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="text-2xl font-bold tracking-tighter text-lgl-fg/60">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-lgl-gold/40 bg-lgl-gold/10 text-lgl-gold">
                          <ValueIcon size={20} />
                        </span>
                      </div>
                      <h3 className="text-lg font-bold tracking-tight text-lgl-fg" style={headingFont}>
                        {value.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-lgl-fg/70">{value.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <Section theme="light" className="pb-20 pt-4 md:pb-28" style={{ background: "var(--lgl-bg)" }}>
        <Container>
          <motion.div
            {...reveal()}
            className="lgl-brand-card relative overflow-hidden rounded-[2rem] border border-lgl-gold/25 px-7 py-10 md:px-14 md:py-14"
          >
            <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-14">
              <div>
                <h2
                  className="max-w-2xl text-balance text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.04em] text-lgl-fg"
                  style={headingFont}
                >
                  {cta.title}
                </h2>
                <div className="mt-5 max-w-2xl space-y-4 text-base leading-[1.8] text-lgl-fg/75 md:text-lg">
                  {cta.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start gap-4">
                <Link href={contactHref} className={`lgl-gold-cta ${pillBase} hover:opacity-85`} style={pillFont}>
                  {cta.button}
                  <span aria-hidden="true">→</span>
                </Link>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-lgl-fg/70 transition-colors hover:text-lgl-gold"
                >
                  <MailIcon size={15} className="text-lgl-gold" />
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}
