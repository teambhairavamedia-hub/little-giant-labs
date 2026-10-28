"use client";

import { type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import {
  ChartIcon,
  FilmIcon,
  LoopIcon,
} from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";

const valueIcons = [FilmIcon, ChartIcon, LoopIcon];

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

export function AboutPageView() {
  const { dict } = useI18n();
  const aboutDict = dict.about;

  return (
    <main>
      {/* Page Header */}
      <PageHeader
        description="We turn business ideas into meaningful brand experiences."
        descriptionClassName="max-w-[19ch] text-[clamp(1.45rem,3.2vw,2.35rem)] font-medium leading-[1.18] tracking-[-0.035em] text-[var(--theme-fg)]"
        theme="dark"
        visual={<AboutHeaderVisual />}
        style={
          {
            background: "var(--lgl-bg)",
            color: "var(--lgl-soft)",
            "--theme-bg": "var(--lgl-bg)",
            "--theme-fg": "var(--lgl-soft)",
            "--theme-fg-muted": "color-mix(in srgb, var(--lgl-soft) 80%, transparent)",
            "--theme-fg-subtle": "color-mix(in srgb, var(--lgl-soft) 72%, transparent)",
            "--theme-border": "color-mix(in srgb, var(--lgl-line) 18%, transparent)",
          } as CSSProperties
        }
      />

      <Section
        theme="light"
        className="border-b border-lgl-fg/10 py-14 md:py-20 lg:py-24"
        style={{ background: "var(--lgl-section)", color: "var(--lgl-fg)" }}
      >
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-x-14 gap-y-7 md:grid-cols-2 md:gap-x-16 lg:gap-x-24">
              <div className="space-y-7 text-base leading-[1.8] text-lgl-fg/75 md:text-lg">
                <p>Little Giant Labs helps businesses build powerful brands and accelerate growth through strategic marketing, creative storytelling and digital innovation.</p>
                <p>As a legal entity of Bhairava Media House LLP, we bring together business understanding, creative communication and technology to help organisations articulate their value, connect with their audiences and stand out in a crowded marketplace.</p>
              </div>
              <div className="space-y-7 text-base leading-[1.8] text-lgl-fg/75 md:text-lg">
                <p>From brand strategy and visual communication to social media, digital campaigns, video production and employer branding, we create communication that brings clarity to your message and consistency to your brand.</p>
                <p>Our multidisciplinary team brings together experience across software engineering, human resources and marketing, enabling us to approach business challenges with both creative thinking and a practical understanding of execution.</p>
                <p>{"We believe the best brand communication doesn't just get noticed. It makes people understand, connect and remember."}</p>
              </div>
            </div>
            <div className="mt-10 md:mt-12">
              <p className="text-center text-[clamp(1.3rem,2.5vw,2rem)] font-medium italic leading-tight tracking-[-0.035em] text-lgl-fg">
                “Little Giant Labs. Big ideas, meaningfully told.”
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Capabilities Section */}
      <Section
        theme="light"
        className="border-t border-lgl-fg/5 py-24 md:py-32"
        style={{ background: "var(--lgl-section)" }}
      >
        <Container>
          <div className="mb-16">
            <h2
              className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-lgl-fg"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              Services
            </h2>
          </div>
          <div className="mb-12 max-w-4xl space-y-5 text-base leading-[1.8] text-lgl-fg/75 md:mb-16 md:text-lg">
            <p className="text-xl font-medium italic tracking-[-0.02em] text-lgl-fg md:text-2xl">
              Strategy meets creativity. Creativity drives connection.
            </p>
            <p>Every business has a story worth telling. The challenge is making that story clear, compelling and relevant to the people who matter.</p>
            <p>At Little Giant Labs, we bring together brand strategy, creative communication, content production and digital marketing to help businesses express their value, strengthen their presence and build meaningful connections with their audiences.</p>
            <p>From defining your brand story to bringing it to life across digital and visual channels, we turn ideas into communication that makes an impact.</p>
          </div>
          <ServiceGrid />
        </Container>
      </Section>

      {/* Our Values Section */}
      <Section theme="light" className="border-t border-lgl-fg/5 py-24 md:py-32">
        <Container>
          <div className="mb-16 text-center max-w-xl mx-auto">
            <p className="label-eyebrow text-lgl-fg/65 mb-5">{aboutDict.principles.eyebrow}</p>
            <h2
              className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-lgl-fg"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              {aboutDict.principles.titlePart1}
              <br />
              <span className="font-light text-lgl-fg/70" style={{ fontStyle: "italic" }}>
                {aboutDict.principles.titleItalic}
              </span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {aboutDict.principles.values.map((v, i) => {
              const ValueIcon = valueIcons[i % valueIcons.length];
              return (
                <Card
                  key={v.title}
                  className="flex flex-col justify-between p-8 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-lgl-fg/20 transition-all duration-300"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-2xl font-bold text-lgl-fg/70 tracking-tighter block">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-lgl-gold">
                        <ValueIcon size={20} />
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold text-lgl-fg tracking-tight"
                      style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                    >
                      {v.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-lgl-fg/70 font-light">
                      {v.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
    </main>
  );
}
