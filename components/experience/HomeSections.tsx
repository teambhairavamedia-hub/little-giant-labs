"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, registerGsap } from "@/hooks/useGsap";
import { experienceConfig } from "@/lib/experience";
import { Section } from "@/components/ui/Section";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatedCounter } from "@/components/experience/AnimatedCounter";


/* ──────────────────────────────────────────────────────────────────────────
   1. CINEMATIC HERO — Noomo-inspired full-viewport white hero
   ────────────────────────────────────────────────────────────────────────── */
type CinematicHeroProps = {
  ready?: boolean;
};

export function CinematicHero({ ready = true }: CinematicHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    registerGsap();
    const ctx = gsap.context(() => {
      gsap.to(".hero-line > span", {
        y: 0,
        opacity: 1,
        duration: 1.3,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.05,
      });

      gsap.to(".hero-subtitle", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.35,
      });

      gsap.to(".hero-scroll-cue", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.5,
      });

      gsap.to(".hero-parallax-content", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <Section
      theme="light"
      className="relative overflow-hidden"
    >
      <div
        ref={sectionRef}
        className="relative flex flex-col justify-center items-center w-full"
        style={{
          background: "#ffffff",
          minHeight: "100svh",
          paddingTop: "clamp(4.5rem, 8vh, 6rem)",
          paddingBottom: "clamp(2rem, 4vh, 3.5rem)",
        }}
      >
        {/* Subtle background texture + soft maroon ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="theme-noise absolute inset-0 opacity-30" />
          <div className="absolute left-[-8%] top-[10%] h-[600px] w-[600px] rounded-full bg-[#800000]/8 blur-[160px]" />
          <div className="absolute right-[-5%] bottom-[5%] h-[500px] w-[500px] rounded-full bg-[#800000]/5 blur-[160px]" />
        </div>

        {/* Main content */}
        <div className="hero-parallax-content relative z-10 flex flex-col items-center text-center w-full max-w-[1060px] mx-auto px-6 md:px-12">

          {/* Heading */}
          <h1
            className="font-bold leading-[0.94] tracking-[-0.045em] text-[#0a0a0a]"
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
            }}
          >
            <span className="hero-line block overflow-hidden">
              <span className="block" style={{ opacity: 0, transform: "translateY(50px)", willChange: "transform, opacity" }}>Design that turns</span>
            </span>
            <span className="hero-line block overflow-hidden">
              <span className="block" style={{ opacity: 0, transform: "translateY(50px)", willChange: "transform, opacity" }}>attention into</span>
            </span>
            <span className="hero-line block overflow-hidden">
              <span
                className="block font-light"
                style={{ fontStyle: "italic", color: "#800000", opacity: 0, transform: "translateY(50px)", willChange: "transform, opacity" }}
              >
                revenue.
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle mt-4 md:mt-5"
            style={{
              maxWidth: "34rem",
              fontSize: "clamp(0.8rem, 1.2vw, 0.9375rem)",
              lineHeight: 1.65,
              color: "rgba(10,10,10,0.55)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-dm-sans), sans-serif",
              opacity: 0,
              transform: "translateY(50px)",
              willChange: "transform, opacity",
            }}
          >
            Award-winning media &amp; marketing agency building cinematic content,
            performance campaigns, and AI-powered growth systems that make
            brands impossible to ignore.
          </p>

          {/* CTA row */}
          <div className="hero-subtitle mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-3" style={{ opacity: 0, transform: "translateY(50px)", willChange: "transform, opacity" }}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full transition-all duration-300 group shadow-md hover:shadow-xl hover:scale-[1.02]"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#ffffff",
                background: "#800000",
                padding: "0.75rem 1.75rem",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
            >
              Partner with us
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full transition-all duration-300"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#800000",
                border: "1px solid rgba(128,0,0,0.25)",
                padding: "0.75rem 1.75rem",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(128,0,0,0.06)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#800000";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(128,0,0,0.25)";
              }}
            >
              View Our Work
            </Link>
          </div>

          {/* Social proof stats */}
          <div
            className="hero-scroll-cue mt-6 md:mt-7 flex flex-wrap items-center justify-center gap-8 md:gap-14"
            style={{ borderTop: "1px solid rgba(128,0,0,0.12)", paddingTop: "1rem", opacity: 0, transform: "translateY(50px)", willChange: "transform, opacity" }}
          >
            {[
              { value: "120M+", label: "Views Generated" },
              { value: "3×", label: "Avg. ROAS" },
              { value: "10+", label: "Brands Scaled" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span
                  style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: "#800000",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(128,0,0,0.60)",
                    fontWeight: 600,
                    marginTop: "0.2rem",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-cue absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-20 select-none pointer-events-none" style={{ opacity: 0, transform: "translateY(50px)", willChange: "transform, opacity" }}>
          <span
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "0.5rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(128,0,0,0.50)",
              fontWeight: 600,
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path
                d="M6 0V18M6 18L1 13M6 18L11 13"
                stroke="#800000"
                strokeOpacity="0.6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   1b. ABOUT SNAP — Dark bold "who we are" section
   ────────────────────────────────────────────────────────────────────────── */
export function AboutSnap() {
  const services = [
    { icon: "✦", title: "Cinematic Content", desc: "Short-form reels, brand films & social-first storytelling" },
    { icon: "◈", title: "Performance Ads", desc: "Data-driven paid campaigns that scale to 10× ROAS" },
    { icon: "⬡", title: "AI Growth Systems", desc: "Automation & analytics stacks that compound results" },
    { icon: "◎", title: "Brand Identity", desc: "Visual systems, strategy & positioning for category leaders" },
  ];

  return (
    <section style={{ background: "#800000", position: "relative", overflow: "hidden" }}>
      {/* Subtle glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,0.04)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "rgba(255,255,255,0.03)", filter: "blur(100px)" }} />
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "clamp(4rem,10vw,7rem) clamp(1.5rem,5vw,3.5rem)" }}>

        {/* Top row: label + heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "clamp(3rem,7vw,5rem)" }}>
          <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "0.6875rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
            About Bhairava Media
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 0.97,
                color: "#ffffff",
                maxWidth: "24ch",
              }}
            >
              We don&apos;t just make content.
              <br />
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 400, fontStyle: "italic" }}>
                We build movements.
              </span>
            </h2>
          </div>
        </div>

        {/* Two-column: manifesto left, services right */}
        <div className="about-snap-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,6vw,5rem)", alignItems: "start" }}>

          {/* LEFT: philosophy */}
          <div>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "clamp(0.95rem,1.4vw,1.125rem)", lineHeight: 1.75, color: "#ffffff", fontWeight: 400, marginBottom: "2rem" }}>
              Bhairava Media was born from a simple belief: great creative work should also drive measurable business results. We sit at the intersection of storytelling and strategy — building the kind of content that earns attention and converts it into revenue.
            </p>

            {/* Philosophy pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["Story-first", "Data-driven", "Brand-obsessed", "Always iterating"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.40)",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 100,
                    padding: "0.45rem 1rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: services grid */}
          <div className="about-services-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", border: "1px solid rgba(255,255,255,0.20)", borderRadius: 16, overflow: "hidden" }}>
            {services.map((s) => (
              <div
                key={s.title}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  padding: "1.5rem",
                  borderRight: "1px solid rgba(255,255,255,0.15)",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span style={{ fontSize: "1.1rem", color: "#ffffff", display: "block", marginBottom: "0.75rem" }}>{s.icon}</span>
                <p style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>{s.title}</p>
                <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "0.8125rem", lineHeight: 1.6, color: "rgba(255,255,255,0.88)", fontWeight: 400 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   DARK DIVIDER — Cinematic black statement break between sections
   Pass a quote and optional sub-label to customise
   ────────────────────────────────────────────────────────────────────────── */
export function DarkDivider({
  quote = "Built for brands that refuse to be ignored.",
  label = "Our Approach",
}: {
  quote?: string;
  label?: string;
}) {
  return (
    <div
      style={{
        background: "#800000",
        padding: "clamp(3rem, 7vw, 5.5rem) clamp(1.5rem, 5vw, 3.5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* thin top line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.15)" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <p
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(1.5rem, 4vw, 3.25rem)",
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#ffffff",
            maxWidth: "28ch",
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>
        <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "0.6875rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", fontWeight: 600, flexShrink: 0 }}>
          {label}
        </p>
      </div>

      {/* thin bottom line */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   2. MARQUEE TEXT
   ────────────────────────────────────────────────────────────────────────── */
const brands = [
  { name: "IDFC First Bank", label: "IDFC First Bank" },
  { name: "LSF", label: "LSF" },
  { name: "Freshoo", label: "Freshoo" },
  { name: "Happy Minds", label: "Happy Minds" },
  { name: "Quberx", label: "Quberx"}
];

export function MarqueeText() {
  const items = [...brands, ...brands, ...brands, ...brands];

  return (
    <Section
      theme="light"
      className="overflow-hidden border-y select-none"
      style={{ background: "#ffffff", borderColor: "rgba(10,10,10,0.07)", padding: "0.85rem 0" }}
    >
      <div className="marquee-track flex w-max items-center" style={{ gap: "30px" }}>
        {items.map((brand, index) => (
          <div
            key={`${brand.label}-${index}`}
            className="flex shrink-0 items-center"
            style={{ gap: "30px" }}
          >
            <span
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(10,10,10,0.68)",
                whiteSpace: "nowrap",
              }}
            >
              {brand.label}
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "rgba(10,10,10,0.18)",
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3. STORY STICKY (PROCESS)
   ────────────────────────────────────────────────────────────────────────── */
type StoryStickyProps = {
  ready?: boolean;
};

const chapters = [
  {
    num: "01",
    phase: "Discover",
    title: "Audience intelligence.",
    body: "We audit competitor funnels, decode market patterns, and leverage AI insights to map exactly where your audience's attention lives — before a single campaign launches.",
  },
  {
    num: "02",
    phase: "Create",
    title: "Cinematic content & campaigns.",
    body: "From high-impact brand videos to performance ad systems, we craft assets and launch paid channels engineered for retention, conversion, and deep brand equity.",
  },
  {
    num: "03",
    phase: "Scale",
    title: "AI & automation loops.",
    body: "We integrate custom dashboards, retention CRM loops, and AI-driven workflows that compound results — turning marketing into a self-reinforcing growth engine.",
  },
];

export function StorySticky({ ready = true }: StoryStickyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const panels = gsap.utils.toArray<HTMLElement>(".story-panel");

    const ctx = gsap.context(() => {
      gsap.from(".story-heading", {
        y: 50,
        opacity: 0,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0.18, scale: 0.95, y: 60 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.6,
            },
          }
        );

        gsap.to(panel, {
          opacity: 0.3,
          scale: 0.97,
          scrollTrigger: {
            trigger: panel,
            start: "bottom 40%",
            end: "bottom 15%",
            scrub: 0.6,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [ready]);

  return (
    <Section theme="light" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div
        ref={sectionRef}
        className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="lg:sticky lg:top-36 lg:self-start">
          <p className="label-eyebrow mb-5 text-[#0a0a0a]/40">
            Our Process
          </p>
          <h2 className="story-heading mt-6 text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[0.96] tracking-[-0.04em] text-[#0a0a0a]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            Three steps to
            <br />
            <span className="text-[#0a0a0a]/25">scale.</span>
          </h2>
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-[1.7] text-theme-muted font-light">
            We bridge the gap between creative storytelling and analytical performance, taking brands from launch to scale.
          </p>
        </div>

        <div className="space-y-12">
          {chapters.map((chapter) => (
            <article
              key={chapter.num}
              className="story-panel rounded-[2rem] p-8 md:p-12 border border-[#e4e4e7] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative overflow-hidden"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex items-center justify-between">
                <span className="label-eyebrow text-[#0a0a0a]/38">
                  Phase {chapter.num} — {chapter.phase}
                </span>
                <span className="text-sm font-semibold text-[#0a0a0a]/12 tracking-[-0.02em]">
                  {chapter.num}
                </span>
              </div>
              <h3 className="mt-6 text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-[-0.04em] leading-[1.0] text-[#0a0a0a]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                {chapter.title}
              </h3>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.7] text-[#0a0a0a]/52 font-light">
                {chapter.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   5. SELECTED WORK — Editorial List with Cursor-Following Image Reveal
   ────────────────────────────────────────────────────────────────────────── */
type HorizontalPortfolioProps = {
  ready?: boolean;
};

const portfolioWithRevenue = experienceConfig.portfolio.map((project, index) => {
  const revenues = ["₹1.8Cr", "₹2.1Cr", "₹4.5Cr", "₹3.2Cr", "₹2.6Cr"];
  return {
    ...project,
    revenue: revenues[index] || "₹2.0Cr",
  };
});

type ProjectItem = (typeof experienceConfig.portfolio)[number] & {
  revenue: string;
};

export function HorizontalPortfolio({ ready = true }: HorizontalPortfolioProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string>(portfolioWithRevenue[0].slug);
  const [selectedProject, setSelectedProject] = useState<(typeof portfolioWithRevenue)[number] | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  /* Animate rows in on scroll */
  useEffect(() => {
    if (!ready) return;
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".work-row", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });
    }, section);

    return () => ctx.revert();
  }, [ready]);

  /* Play active video, pause others */
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((slug) => {
      const v = videoRefs.current[slug];
      if (!v) return;
      if (slug === activeSlug) {
        v.currentTime = 0;
        void v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeSlug]);

  const activeProject = portfolioWithRevenue.find((p) => p.slug === activeSlug) || portfolioWithRevenue[0];

  return (
    <Section theme="light" className="relative overflow-hidden" style={{ background: "#ffffff" }}>
      <div ref={sectionRef} className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14 py-20 md:py-28">
        
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="label-eyebrow mb-4 text-[#0a0a0a]/38">Selected Work</p>
            <h2
              className="text-[clamp(2.2rem,5.5vw,4rem)] font-bold tracking-[-0.04em] leading-[0.96] text-[#0a0a0a]"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              Stories that
              <br />
              <span className="font-light text-[#0a0a0a]/22" style={{ fontStyle: "italic" }}>
                drive results.
              </span>
            </h2>
          </div>
          <Link
            href="/work"
            className="hidden shrink-0 label-nav text-[#0a0a0a]/40 transition-opacity hover:opacity-100 hover:text-[#0a0a0a] md:inline-flex items-center gap-2 uppercase tracking-widest text-xs font-semibold"
          >
            VIEW ALL →
          </Link>
        </div>

        {/* Top border */}
        <div className="h-[1px] w-full bg-[#0a0a0a]/10 mb-8" />

        {/* Split Grid Layout: Left List pinned at top, Right Side-by-side Dynamic Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Case Study Row List (spans 7 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col">
            {portfolioWithRevenue.map((project, index) => {
              const isActive = project.slug === activeSlug;
              return (
                <div key={project.slug} className="work-row">
                  <div
                    onClick={() => {
                      setActiveSlug(project.slug);
                      setSelectedProject(project);
                    }}
                    onMouseEnter={() => setActiveSlug(project.slug)}
                    className="group relative flex w-full items-center justify-between gap-6 border-b border-[#e8e8e6] py-5 md:py-6 transition-all duration-300 hover:border-[#0a0a0a]/20 cursor-pointer"
                    style={{
                      opacity: isActive ? 1 : 0.45,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {/* Index + Client Name */}
                    <div className="flex items-center gap-6 md:gap-8 min-w-0">
                      <span
                        className="w-8 shrink-0 text-[0.75rem] font-medium tabular-nums text-[#0a0a0a]/35 transition-colors duration-300 group-hover:text-[#0a0a0a]"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3
                        className="truncate text-[clamp(1.25rem,2.2vw,2rem)] font-bold leading-none tracking-[-0.03em] text-[#0a0a0a] transition-all duration-300 group-hover:text-[#0a0a0a]"
                        style={{ fontFamily: "var(--font-syne), sans-serif" }}
                      >
                        {project.client}
                      </h3>
                    </div>

                    {/* Right side category badge and arrow */}
                    <div className="flex items-center gap-4">
                      {/* Category Pill */}
                      <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-[#0a0a0a]/40 group-hover:text-[#0a0a0a]/70 transition-colors duration-300">
                        {project.category}
                      </span>
                      
                      {/* Interactive Arrow Button */}
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition-all duration-300 ${
                          isActive
                            ? "opacity-100 translate-x-0 border-black/30 bg-black text-white"
                            : "opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:border-black/20"
                        }`}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>

                    {/* Bottom hover indicator line */}
                    <span className="pointer-events-none absolute bottom-[-1px] left-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Side-by-Side Interactive Preview Panel (spans 5 columns on desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-start gap-4">
            
            {/* Dynamic Aspect Ratio Preview Frame matching exact video/image size */}
            <div
              onClick={() => setSelectedProject(activeProject)}
              className="relative w-full max-w-[440px] overflow-hidden rounded-[1.25rem] bg-[#800000] border border-white/10 shadow-2xl cursor-pointer group flex items-center justify-center transition-all duration-300 ease-out"
              style={{
                aspectRatio: (activeProject as any).aspectRatio || "16/9",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#800000]"
                >
                  {/* Main media element — 100% full bleed edge-to-edge image without margins */}
                  <img
                    src={activeProject.image}
                    alt={activeProject.client}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  />

                  {/* Play badge for video case studies */}
                  {activeProject.video && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/65 border border-white/25 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-black text-white transition-all duration-300 shadow-xl">
                        <span className="text-xs ml-0.5">▶</span>
                      </div>
                    </div>
                  )}

                  {/* Vignette mask */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Top-Left Live Preview Badge */}
              <div
                className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1 z-20"
                style={{
                  background: "rgba(0,0,0,0.65)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.55rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 600,
                  }}
                >
                  PREVIEW
                </span>
              </div>

              {/* Top-Right Metric Badge */}
              <div
                className="absolute top-4 right-4 rounded-full px-3 py-1 z-20 text-white shadow-lg"
                style={{
                  background: "rgba(0,0,0,0.75)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              >
                {activeProject.metric}
              </div>
            </div>

            {/* Project Metadata Under the Preview Card */}
            <div className="w-full px-1 flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#0a0a0a]/40 tracking-widest">
                  {activeProject.category}
                </p>
                <p
                  className="mt-1 text-sm font-semibold tracking-[-0.02em] text-[#0a0a0a]"
                  style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                  {activeProject.client}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-[#0a0a0a]/40 tracking-widest">
                  {/* Revenue Impact */}
                </p>
                <p
                  className="mt-1 text-sm font-bold tracking-[-0.02em] text-[#0a0a0a]"
                  style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                  {/* {activeProject.revenue} */}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile: View all link */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/work"
            className="label-nav text-[#0a0a0a]/50 border-b border-[#0a0a0a]/15 pb-1 transition-colors hover:text-[#0a0a0a] hover:border-[#0a0a0a]"
          >
            View all projects →
          </Link>
        </div>

        {/* Showcase Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-[#0a0a0a] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-white/10"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-white/20 transition-all duration-200 z-50 flex items-center justify-center cursor-pointer"
                  aria-label="Close"
                >
                  <span className="text-sm">✕</span>
                </button>

                {/* Video Player or Detail Image */}
                <div className="aspect-video w-full bg-black relative border-b border-white/10 overflow-hidden flex items-center justify-center">
                  {selectedProject.video ? (
                    <video
                      src={selectedProject.video}
                      poster={selectedProject.image}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={(selectedProject as any).detailImage || selectedProject.image}
                      alt={selectedProject.client}
                      className="w-full h-full object-contain bg-black/90"
                    />
                  )}
                </div>

                {/* Narrative Sections */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold block mb-1">
                        {selectedProject.category}
                      </span>
                      <h2
                        className="text-2xl md:text-3xl font-bold tracking-tight"
                        style={{ fontFamily: "var(--font-syne), sans-serif" }}
                      >
                        {selectedProject.client}
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 shrink-0">
                      <span className="text-xs text-white/40 block text-center mb-0.5">Primary Outcome</span>
                      <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                        {selectedProject.metric}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">The Challenge</h4>
                      <p className="text-sm text-white/70 leading-relaxed font-light">{selectedProject.challenge}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Strategy & Execution</h4>
                      <p className="text-sm text-white/70 leading-relaxed font-light">{selectedProject.approach}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Key Outcomes</h4>
                      <ul className="space-y-2">
                        {selectedProject.results?.map((res, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-white/80 font-light">
                            <span className="text-[#d4af37] mt-0.5 shrink-0">✦</span>
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                  <Link
                    href="/contact"
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold bg-white text-black hover:bg-[#d4af37] transition-all duration-300 group"
                    style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "0.875rem" }}
                  >
                    <span>Discuss A Similar Campaign</span>
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Section>
  );
}


/* ──────────────────────────────────────────────────────────────────────────
   6. REEL SHOWCASE — Dark split-screen: left portrait video, right list
   ────────────────────────────────────────────────────────────────────────── */
type ReelStackProps = {
  ready?: boolean;
};

type YouTubePlayer = {
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
  loadVideoById: (videoId: string) => void;
  mute: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};

type YouTubePlayerEvent = { target: YouTubePlayer };
type YouTubeErrorEvent = { data: number };
type YouTubeStateEvent = { data: number; target: YouTubePlayer };
type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      width: string;
      height: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: YouTubePlayerEvent) => void;
        onError: (event: YouTubeErrorEvent) => void;
        onAutoplayBlocked: () => void;
        onStateChange: (event: YouTubeStateEvent) => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | undefined;
let activeYouTubeReelPlayer: YouTubePlayer | null = null;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      window.onYouTubeIframeAPIReady = previousCallback;
      previousCallback?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube IFrame Player API did not initialize."));
    };

    let script = document.getElementById("youtube-iframe-api") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        window.onYouTubeIframeAPIReady = previousCallback;
        reject(new Error("Unable to load YouTube IFrame Player API."));
      };
      document.head.appendChild(script);
    }
  }).catch((error: unknown) => {
    youtubeApiPromise = undefined;
    throw error;
  });

  return youtubeApiPromise;
}

type YouTubeReelPlayerProps = {
  videoId: string;
  active: boolean;
  initialize: boolean;
  title: string;
};

function YouTubeReelPlayer({ videoId, active, initialize, title }: YouTubeReelPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const activeRef = useRef(active);
  const videoIdRef = useRef(videoId);
  const loadedVideoIdRef = useRef(videoId);
  const [isReady, setIsReady] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    videoIdRef.current = videoId;
  }, [videoId]);

  useEffect(() => {
    if (!initialize || !hostRef.current || playerRef.current) return;

    let cancelled = false;
    let player: YouTubePlayer | null = null;
    let playerDestroyed = false;

    void loadYouTubeIframeApi()
      .then((youtube) => {
        if (cancelled || !hostRef.current) return;

        player = new youtube.Player(hostRef.current, {
          width: "200",
          height: "200",
          videoId: videoIdRef.current,
          playerVars: {
            autoplay: 0,
            controls: 1,
            loop: 1,
            playlist: videoIdRef.current,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) {
                if (!playerDestroyed) {
                  playerDestroyed = true;
                  event.target.destroy();
                }
                return;
              }
              playerRef.current = event.target;
              const iframe = event.target.getIframe();
              iframe.title = `YouTube video: ${title}`;
              iframe.classList.add("youtube-reel-player");
              iframe.style.position = "absolute";
              iframe.style.inset = "0";
              iframe.style.width = "100%";
              iframe.style.height = "100%";
              iframe.style.border = "0";
              iframe.style.minWidth = "200px";
              iframe.style.left = "50%";
              iframe.style.transform = "translateX(-50%)";
              iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
              iframe.allowFullscreen = true;
              event.target.mute();
              setIsReady(true);
            },
            onError: (event) => {
              // Keep the existing card and overlays stable if YouTube rejects playback.
              console.error(`YouTube reel player error (${event.data}) for ${videoIdRef.current}.`);
            },
            onAutoplayBlocked: () => setAutoplayBlocked(true),
            onStateChange: (event) => {
              if (event.data === 0 && activeRef.current) {
                event.target.seekTo(0, true);
                event.target.playVideo();
              }
            },
          },
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error("YouTube reel player could not be initialized.", error);
      });

    return () => {
      cancelled = true;
      setIsReady(false);
      setAutoplayBlocked(false);
      if (playerRef.current) {
        if (activeYouTubeReelPlayer === playerRef.current) activeYouTubeReelPlayer = null;
        if (!playerDestroyed) {
          playerDestroyed = true;
          playerRef.current.destroy();
        }
        playerRef.current = null;
      } else if (player && !playerDestroyed) {
        playerDestroyed = true;
        player.destroy();
      }
    };
  }, [initialize, title]);

  useEffect(() => {
    const player = playerRef.current;
    if (!isReady || !player) return;

    try {
      if (!active) {
        player.pauseVideo();
        if (activeYouTubeReelPlayer === player) activeYouTubeReelPlayer = null;
        return;
      }

      if (activeYouTubeReelPlayer && activeYouTubeReelPlayer !== player) {
        activeYouTubeReelPlayer.pauseVideo();
      }
      activeYouTubeReelPlayer = player;

      if (loadedVideoIdRef.current !== videoId) {
        loadedVideoIdRef.current = videoId;
        player.loadVideoById(videoId);
        return;
      }
      player.playVideo();
    } catch (error) {
      console.error("YouTube reel playback could not be started.", error);
    }
  }, [active, isReady, videoId]);

  return (
    <>
      <div ref={hostRef} aria-label={`Player for ${title}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {autoplayBlocked && active && (
        <button
          type="button"
          onClick={() => {
            const player = playerRef.current;
            if (!player) return;
            player.mute();
            player.playVideo();
            setAutoplayBlocked(false);
          }}
          className="absolute inset-0 z-[2] flex items-center justify-center text-white"
          style={{ background: "rgba(0,0,0,0.35)" }}
          aria-label={`Play ${title}`}
        >
          <span style={{ display: "flex", width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(0,0,0,0.65)", fontSize: 18 }}>▶</span>
        </button>
      )}
    </>
  );
}

export function ReelStack({ ready = true }: ReelStackProps) {
  void ready;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [visibleMobileReels, setVisibleMobileReels] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const mobileRowRef = useRef<HTMLDivElement>(null);
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { reels } = experienceConfig;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      setIsSectionVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.6] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isDesktop !== false) return;
    const row = mobileRowRef.current;
    if (!row || typeof IntersectionObserver === "undefined") {
      setVisibleMobileReels(new Set(reels.map((_, index) => index)));
      return;
    }

    const cards = Array.from(row.querySelectorAll<HTMLElement>("[data-reel-card]"));
    const ratios = new Map<number, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.reelIndex);
          if (entry.isIntersecting) ratios.set(index, entry.intersectionRatio);
          else ratios.delete(index);
        }

        setVisibleMobileReels(new Set(ratios.keys()));
        const mostVisible = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
        if (mostVisible && mostVisible[1] >= 0.5) setActiveIndex(mostVisible[0]);
      },
      { root: row, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isDesktop, reels]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => () => {
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
  }, []);

  /* Switch reel with short cross-fade */
  const switchReel = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    switchTimerRef.current = setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
      switchTimerRef.current = null;
    }, 220);
  };

  return (
    <Section ref={sectionRef} theme="dark" className="relative" style={{ background: "#800000" }}>

      <div className="mx-auto max-w-[1320px] px-6 md:px-10 lg:px-14 py-20 md:py-28">

        {/* ── DESKTOP layout ─────────────────────────────────────────── */}
        {isDesktop === true && <div className="flex md:flex-row md:items-stretch md:gap-14 lg:gap-20">

          {/* LEFT: portrait video */}
          <div className="flex flex-col items-center justify-center gap-4 shrink-0">
            {/* Phone-like video card — fixed 9:16 */}
            <div
              style={{
                position: "relative",
                width: 340,
                height: 604,   /* 340 × 16/9 ≈ 604 */
                borderRadius: "1.5rem",
                overflow: "hidden",
                boxShadow: "0 40px 90px rgba(0,0,0,0.7)",
                background: "#111",
              }}
            >
              <div style={{ position: "absolute", inset: 0, opacity: isTransitioning ? 0 : 1, transition: "opacity 0.25s ease", zIndex: 1 }}>
                {reels[activeIndex] && (
                  <YouTubeReelPlayer
                    key="desktop-reel-player"
                    videoId={reels[activeIndex].videoId}
                    title={reels[activeIndex].title}
                    active={isSectionVisible}
                    initialize={isSectionVisible}
                  />
                )}
              </div>

              {/* Bottom info */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)", padding: "2.5rem 1rem 1rem", pointerEvents: "none" }}>
                <p style={{ fontSize: "0.5625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans), sans-serif" }}>{reels[activeIndex]?.views}</p>
                <p style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 600, color: "white", fontSize: "0.9rem", letterSpacing: "-0.02em", marginTop: "0.2rem" }}>{reels[activeIndex]?.title}</p>
              </div>
            </div>

            {/* Dot nav */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {reels.map((_, i) => (
                <button
                  key={i}
                  onClick={() => switchReel(i)}
                  style={{
                    height: 6,
                    width: activeIndex === i ? 20 : 6,
                    borderRadius: 100,
                    background: activeIndex === i ? "white" : "rgba(255,255,255,0.25)",
                    transition: "all 0.3s ease",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: heading + reel list + stats */}
          <div className="flex flex-col justify-center flex-1 min-w-0 py-4">

            {/* Heading */}
            <p className="label-eyebrow mb-4 font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
              Content Engine
            </p>
            <h2
              className="text-[clamp(1.9rem,3.8vw,3rem)] font-bold leading-[0.96] tracking-[-0.04em] text-white"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              Reels built
              <br />
              <span style={{ fontWeight: 400, fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>
                to stop the scroll.
              </span>
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-[1.7] font-normal"
              style={{ color: "rgba(255,255,255,0.90)", maxWidth: "24rem" }}>
              Every piece of content is engineered for retention — hook,
              narrative, and CTA in the first three seconds.
            </p>

            {/* Reel list */}
            <div className="mt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              {reels.map((reel, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={reel.title}
                    onClick={() => switchReel(index)}
                    onMouseEnter={() => switchReel(index)}
                    className="w-full text-left border-b transition-all duration-200"
                    style={{
                      borderColor: "rgba(255,255,255,0.15)",
                      opacity: isActive ? 1 : 0.65,
                      padding: "0.9rem 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", minWidth: 0 }}>
                      {/* Pulse dot */}
                      <span style={{ position: "relative", flexShrink: 0, width: 8, height: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isActive ? (
                          <>
                            <span className="animate-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "white", opacity: 0.45 }} />
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "white", position: "relative" }} />
                          </>
                        ) : (
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
                        )}
                      </span>

                      <div style={{ minWidth: 0 }}>
                        <p
                          className="truncate font-semibold text-white"
                          style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1rem", letterSpacing: "-0.02em" }}
                        >
                          {reel.title}
                        </p>
                        <p style={{ fontSize: "0.625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: "0.2rem", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                          {reel.views}
                        </p>
                      </div>
                    </div>

                    {/* Play icon */}
                    <span style={{
                      flexShrink: 0,
                      width: 28, height: 28,
                      borderRadius: "50%",
                      border: `1px solid rgba(255,255,255,${isActive ? 0.28 : 0.12})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.2s",
                    }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M2 1.5l5 3-5 3V1.5z" fill="white" />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-7 flex items-center gap-6">
              <div>
                <p className="font-bold text-white" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.75rem", letterSpacing: "-0.04em" }}>120M+</p>
                <p style={{ fontSize: "0.625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.30)", fontFamily: "var(--font-dm-sans), sans-serif", marginTop: "0.2rem" }}>Total Views</p>
              </div>
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.10)" }} />
              <div>
                <p className="font-bold text-white" style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "1.75rem", letterSpacing: "-0.04em" }}>{reels.length * 2}+</p>
                <p style={{ fontSize: "0.625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.30)", fontFamily: "var(--font-dm-sans), sans-serif", marginTop: "0.2rem" }}>Formats</p>
              </div>
            </div>
          </div>

        </div>}

        {/* ── MOBILE layout ──────────────────────────────────────────── */}
        {isDesktop === false && <div>
          <p className="label-eyebrow mb-4" style={{ color: "rgba(255,255,255,0.30)" }}>Content Engine</p>
          <h2
            className="text-[clamp(1.75rem,7vw,2.5rem)] font-bold leading-[0.96] tracking-[-0.04em] text-white mb-8"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            Reels built to
            <br />
            <span style={{ fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.22)" }}>stop the scroll.</span>
          </h2>

          {/* Snap scroll row */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-4"
            style={{ scrollSnapType: "x mandatory" }}>
            {reels.map((reel, index) => (
              <div
                key={reel.title}
                data-reel-card
                data-reel-index={index}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  scrollSnapAlign: "center",
                  width: "56vw",
                  maxWidth: 220,
                  height: "calc(56vw * 16/9)",
                  maxHeight: 390,
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                  background: "#111",
                }}
              >
                <YouTubeReelPlayer
                  videoId={reel.videoId}
                  title={reel.title}
                  active={isSectionVisible && activeIndex === index}
                  initialize={isSectionVisible && visibleMobileReels.has(index)}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.875rem", pointerEvents: "none" }}>
                  <p style={{ fontSize: "0.5625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.40)", fontFamily: "var(--font-dm-sans), sans-serif" }}>{reel.views}</p>
                  <p style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 600, fontSize: "0.8125rem", color: "white", marginTop: "0.2rem" }}>{reel.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>}

      </div>
    </Section>
  );
}



/* ──────────────────────────────────────────────────────────────────────────
   8. TESTIMONIALS — Cinematic dual-row infinite marquee (Wall of Love)
   ────────────────────────────────────────────────────────────────────────── */

const allTestimonials = [
  {
    quote: "Bhairava Media didn't just run ads — they built us a content machine. Our ROAS went from 1.2× to 4.8× in 60 days.",
    author: "Riya Sharma",
    role: "Founder, Nova Skincare",
    initials: "RS",
    avatarBg: "linear-gradient(135deg, #4b5563 0%, #1f2937 100%)",
    stars: 5,
  },
  {
    quote: "Every deliverable felt premium. The team understood our brand voice better than agencies we had worked with for years.",
    author: "Marcus Vance",
    role: "CMO, Pulse Fitness",
    initials: "MV",
    avatarBg: "linear-gradient(135deg, #374151 0%, #111827 100%)",
    stars: 5,
  },
  {
    quote: "120M+ views and counting. What they built for us in 90 days would have taken us 2 years to figure out alone.",
    author: "Arjun Mehta",
    role: "CEO, Ember Hotels",
    initials: "AM",
    avatarBg: "linear-gradient(135deg, #1f2937 0%, #030712 100%)",
    stars: 5,
  },
  {
    quote: "Not just creatives — strategists. They challenged our assumptions, rebuilt our funnel, and tripled our lead volume.",
    author: "Priya Nair",
    role: "Head of Growth, Axis Fintech",
    initials: "PN",
    avatarBg: "linear-gradient(135deg, #6b7280 0%, #374151 100%)",
    stars: 5,
  },
  {
    quote: "The content quality was unlike anything we had seen. Our audience grew 3× in the first month alone.",
    author: "Siddharth Roy",
    role: "Co-founder, Velvet Co.",
    initials: "SR",
    avatarBg: "linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)",
    stars: 5,
  },
  {
    quote: "Incredible attention to detail. Every frame, every caption — crafted with intent. Our brand has never looked better.",
    author: "Anika Joshi",
    role: "Marketing Director, LuxeWear",
    initials: "AJ",
    avatarBg: "linear-gradient(135deg, #4b5563 0%, #111827 100%)",
    stars: 5,
  },
  {
    quote: "They delivered 10× more than we expected. Our content pipeline is now completely self-sustaining thanks to them.",
    author: "Karan Mehrotra",
    role: "CEO, GrowthStack",
    initials: "KM",
    avatarBg: "linear-gradient(135deg, #374151 0%, #030712 100%)",
    stars: 5,
  },
  {
    quote: "The AI-driven systems they set up compound results over time. Six months in, we are still seeing growth month-over-month.",
    author: "Deepa Iyer",
    role: "VP Growth, CloudScale",
    initials: "DI",
    avatarBg: "linear-gradient(135deg, #1f2937 0%, #1f2937 100%)",
    stars: 5,
  },
];

/* ── Single testimonial card ── */
function TestimonialCard({ t }: { t: (typeof allTestimonials)[number] }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: "clamp(300px, 28vw, 400px)",
        background: "#ffffff",
        border: "1px solid rgba(10,10,10,0.08)",
        borderRadius: "1.25rem",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        boxShadow: "0 15px 40px rgba(0,0,0,0.03)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const div = e.currentTarget as HTMLDivElement;
        div.style.borderColor = "rgba(10,10,10,0.18)";
        div.style.boxShadow = "0 20px 50px rgba(0,0,0,0.07)";
      }}
      onMouseLeave={(e) => {
        const div = e.currentTarget as HTMLDivElement;
        div.style.borderColor = "rgba(10,10,10,0.08)";
        div.style.boxShadow = "0 15px 40px rgba(0,0,0,0.03)";
      }}
    >
      {/* Decorative large quote */}
      <span
        style={{
          position: "absolute",
          top: "-0.75rem",
          right: "1.25rem",
          fontFamily: "Georgia, serif",
          fontSize: "6rem",
          lineHeight: 1,
          color: "rgba(10,10,10,0.04)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        &ldquo;
      </span>

      {/* Stars */}
      <div style={{ display: "flex", gap: "0.2rem" }}>
        {[...Array(t.stars)].map((_, s) => (
          <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1l1.236 3.8H11L8.382 7.1 9.618 11 6 8.9 2.382 11l1.236-3.9L1 4.8h3.764L6 1z" fill="#f59e0b" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
          fontWeight: 400,
          lineHeight: 1.65,
          letterSpacing: "-0.01em",
          color: "rgba(10,10,10,0.65)",
          margin: 0,
          flex: 1,
        }}
      >
        {t.quote}
      </blockquote>

      {/* Author */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderTop: "1px solid rgba(10,10,10,0.07)",
          paddingTop: "1.1rem",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: t.avatarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: "0.625rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.04em",
            }}
          >
            {t.initials}
          </span>
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#0a0a0a",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {t.author}
          </p>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "0.5625rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(10,10,10,0.42)",
              marginTop: "0.15rem",
            }}
          >
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Marquee row (direction: left or right) ── */
function MarqueeRow({
  items,
  direction = "left",
  speed = 38,
}: {
  items: (typeof allTestimonials);
  direction?: "left" | "right";
  speed?: number;
}) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  const totalCards = doubled.length;
  const cardW = 400; // max card width
  const gap = 20;
  const totalWidth = totalCards * (cardW + gap);
  const duration = totalWidth / speed;

  const keyframeName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      {/* Fade edges */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "8%",
          background: "linear-gradient(to right, #ffffff, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "8%",
          background: "linear-gradient(to left, #ffffff, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-row-inner:hover { animation-play-state: paused !important; }
      `}</style>

      <div
        className="marquee-row-inner"
        style={{
          display: "flex",
          gap: `${gap}px`,
          animation: `${keyframeName} ${duration}s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.author}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsAsymmetric() {
  const row1 = allTestimonials.slice(0, 5);
  const row2 = allTestimonials.slice(3);

  return (
    <section style={{ background: "#ffffff", position: "relative", overflow: "hidden" }}>

      {/* Ambient glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "20%", width: 700, height: 700, borderRadius: "50%", background: "rgba(99,102,241,0.04)", filter: "blur(130px)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "15%", width: 600, height: 600, borderRadius: "50%", background: "rgba(244,63,94,0.03)", filter: "blur(120px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "clamp(4rem,10vw,7rem) 0" }}>

        {/* Header */}
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,3.5rem)", marginBottom: "clamp(2.5rem,6vw,4rem)" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "0.625rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(10,10,10,0.38)",
                fontWeight: 500,
                marginBottom: "1.25rem",
              }}
            >
              Client Stories
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
              <h2
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "clamp(2rem,5vw,4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.97,
                  color: "#0a0a0a",
                  margin: 0,
                }}
              >
                What our partners
                <br />
                <span style={{ color: "rgba(10,10,10,0.25)", fontWeight: 300, fontStyle: "italic" }}>
                  say about us.
                </span>
              </h2>

              {/* Trust badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  border: "1px solid rgba(10,10,10,0.08)",
                  borderRadius: "100px",
                  padding: "0.6rem 1.1rem",
                  background: "rgba(10,10,10,0.02)",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", gap: "0.15rem" }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1l1.236 3.8H11L8.382 7.1 9.618 11 6 8.9 2.382 11l1.236-3.9L1 4.8h3.764L6 1z" fill="#f59e0b" />
                    </svg>
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(10,10,10,0.46)",
                    fontWeight: 500,
                  }}
                >
                  10+ brands scaled
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marquee rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <MarqueeRow items={row1} direction="left" speed={55} />
          <MarqueeRow items={row2} direction="right" speed={48} />
        </div>

      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   9. EXPERIENCE CLOSING
   ────────────────────────────────────────────────────────────────────────── */
type ExperienceClosingProps = {
  ready?: boolean;
};

export function ExperienceClosing({ ready = true }: ExperienceClosingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(".closing-line > span, .closing-copy", { opacity: 0, y: 36 });

      gsap.to(".closing-line > span", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: { trigger: section, start: "top 76%" },
      });

      gsap.to(".closing-copy", {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: { trigger: section, start: "top 76%" },
      });
    }, section);

    return () => ctx.revert();
  }, [ready]);

  return (
    <Section
      theme="light"
      className="relative overflow-hidden px-6 py-32 md:px-10 md:py-40 lg:px-16"
      style={{ background: "#ffffff" }}
    >
      <div ref={sectionRef} className="relative w-full">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e0e7ff]/40 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] text-center flex flex-col items-center">
          <h2 className="text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.96] tracking-[-0.05em]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
            <span className="closing-line block overflow-hidden">
              <span className="block text-[#0a0a0a]">Ready to build</span>
            </span>
            <span className="closing-line block overflow-hidden">
              <span className="block text-[#0a0a0a]/22 font-light" style={{ fontStyle: "italic" }}>your next chapter?</span>
            </span>
          </h2>

          <p className="closing-copy mx-auto mt-8 max-w-xl text-[0.9375rem] leading-[1.7] text-theme-muted font-light md:text-[1.0625rem]">
            Let&apos;s architect a growth experience that feels as premium as the
            brand you&apos;re building.
          </p>

          <div className="closing-copy mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton href="/contact">Start a Project</MagneticButton>
            <MagneticButton href="/contact" variant="ghost">
              Book Strategy Call
            </MagneticButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
