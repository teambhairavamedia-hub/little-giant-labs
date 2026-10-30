"use client";

import { type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { accentTitle } from "@/components/ui/accentTitle";
import {
  ChartIcon,
  CompassIcon,
  LayersIcon,
  SparkIcon,
} from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";

const stageIcons = [SparkIcon, ChartIcon, LayersIcon];

const easeOut = [0.22, 1, 0.36, 1] as const;

/* Shared pill-button styles (gold primary matches the header CTA) */
const pillBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300";
const pillFont: CSSProperties = { fontFamily: "var(--font-dm-sans), sans-serif" };
const headingFont: CSSProperties = { fontFamily: "var(--font-manrope), sans-serif" };
/* Green icon badge shared with the rest of the site (.lgl-icon-badge); it fills when its `group` card is hovered */
const greenBadge = "lgl-icon-badge";

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

/* Section label (homepage eyebrow style) + section title */
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
      <p className={`home-eyebrow ${centered ? "justify-center" : ""}`}>{eyebrow}</p>
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
  const { header, story, purpose, approach, engagement, cta } = dict.about;
  const contactHref = getLocalizedPath("/contact", locale);
  const servicesHref = getLocalizedPath("/services", locale);


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
        <Container className="relative pb-12 md:pb-18">
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
            <Link href={servicesHref} className={`lgl-gold-cta ${pillBase} mt-9 hover:opacity-85`} style={pillFont}>
              {header.secondaryCta}
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </Container>
      </Section>

      {/* ── Our story ────────────────────────────────────────────── */}
      <Section
        theme="light"
        className="border-b border-lgl-fg/10 py-12 md:py-18"
        style={{ background: "var(--lgl-section)", color: "var(--lgl-fg)" }}
      >
        <Container>
          <div className="mx-auto max-w-4xl">
            <motion.div {...reveal()}>
              <SectionHeading eyebrow={story.eyebrow} />
              <p
                className="mt-6 text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold leading-[1.45] tracking-[-0.025em] text-lgl-fg"
                style={headingFont}
              >
                {story.paragraphs[0]}
              </p>
            </motion.div>
            <div className="mt-8 space-y-6 text-base leading-[1.85] text-lgl-fg/75 md:text-lg">
              {story.paragraphs.slice(1).map((paragraph, index) => (
                <motion.p key={paragraph} {...reveal(0.1 + index * 0.08)}>
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Mission & belief ─────────────────────────────────────── */}
      <Section theme="light" className="py-12 md:py-18" style={{ background: "var(--lgl-bg)" }}>
        <Container>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <motion.div {...reveal()}>
              <Card className="group flex h-full flex-col p-8 transition-all duration-300 hover:border-lgl-gold/40 md:p-10 motion-safe:hover:-translate-y-1">
                <span className={`${greenBadge} h-12 w-12`}>
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
                <span className={`${greenBadge} h-12 w-12`}>
                  <SparkIcon size={22} />
                </span>
                <p className="label-eyebrow mt-7 text-lgl-gold">{purpose.beliefLabel}</p>
                <p className="mt-4 text-lg leading-[1.7] text-lgl-fg md:text-xl">
                  {purpose.belief}
                </p>
              </Card>
            </motion.div>
          </div>
          {/* Philosophy: follows the belief statement, ahead of the process */}
          <motion.div {...reveal(0.15)} className="mx-auto mt-14 flex max-w-3xl flex-col items-center text-center md:mt-20">
            <SectionHeading eyebrow={purpose.philosophyLabel} title={accentTitle(purpose.philosophyTitle)} align="center" />
            <p className="mt-8 text-lg leading-[1.7] text-lgl-fg md:text-xl">{purpose.approach}</p>
          </motion.div>
        </Container>
      </Section>

      {/* ── How we work ──────────────────────────────────────────── */}
      <Section theme="light" className="border-t border-lgl-fg/10 py-12 md:py-18" style={{ background: "var(--lgl-bg)" }}>
        <Container>
          {/* Centred: heading, lead paragraph, supporting paragraphs */}
          <motion.div {...reveal()} className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <SectionHeading eyebrow={approach.eyebrow} title={accentTitle(approach.title)} align="center" />
            <p className="mt-8 text-lg leading-[1.7] text-lgl-fg md:text-xl">{approach.paragraphs[0]}</p>
            {approach.paragraphs.length > 1 && (
              <div className="mt-6 max-w-2xl space-y-4 text-base leading-[1.8] text-lgl-fg/70">
                {approach.paragraphs.slice(1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </motion.div>
        </Container>
      </Section>

      {/* ── Engagement options ───────────────────────────────────── */}
      <Section
        theme="light"
        className="border-y border-lgl-fg/10 py-12 md:py-18"
        style={{ background: "var(--lgl-section)" }}
      >
        <Container>
          <motion.div {...reveal()} className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <SectionHeading eyebrow={engagement.eyebrow} title={accentTitle(engagement.title)} />
            <p className="text-base leading-[1.8] text-lgl-fg/75 md:text-lg">{engagement.description}</p>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {engagement.options.map((option, index) => {
              const StageIcon = stageIcons[index % stageIcons.length];
              return (
                <motion.div key={option.title} {...reveal(index * 0.08)}>
                  <Card className="group relative flex h-full flex-col overflow-hidden p-8 transition-all duration-300 hover:border-lgl-gold/40 motion-safe:hover:-translate-y-1">
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-lgl-gold via-lgl-gold/40 to-lgl-gold/0" />
                    <span className={`${greenBadge} h-11 w-11`}>
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

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <Section theme="light" className="py-12 md:py-18" style={{ background: "var(--lgl-bg)" }}>
        <Container>
          <motion.div
            {...reveal()}
            className="lgl-brand-card relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-lgl-gold/25 px-7 py-10 text-center md:px-14 md:py-14"
          >
            <h2
              className="text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.04em] text-lgl-fg lg:whitespace-nowrap"
              style={headingFont}
            >
              {accentTitle(cta.title)}
            </h2>
            <div className="mx-auto mt-5 max-w-3xl space-y-4 text-base leading-[1.8] text-lgl-fg/75 md:text-lg">
              {cta.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href={contactHref} className={`lgl-gold-cta ${pillBase} mt-8 hover:opacity-85`} style={pillFont}>
              {cta.button}
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}
