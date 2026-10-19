"use client";

import { useState, useRef, type CSSProperties } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CameraIcon, ChartIcon, ChipIcon, CompassIcon, EyeIcon, FilmIcon, GlobeIcon, LayersIcon, LoopIcon } from "@/components/ui/Icons";

const tabIcons = { vision: EyeIcon, background: LayersIcon, philosophy: CompassIcon };

/* Header illustration: a lens whose focus resolves into a rising growth line. */
function AboutHeaderVisual() {
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1" className="text-lgl-line/20">
        <circle cx="160" cy="160" r="150" strokeDasharray="2 8" />
        <circle cx="160" cy="160" r="112" />
        <circle cx="160" cy="160" r="74" />
        <path d="M160,10 V48 M160,272 V310 M10,160 H48 M272,160 H310" />
      </g>
      <circle cx="160" cy="160" r="112" fill="none" stroke="#C5A059" strokeWidth="1.5" strokeDasharray="120 584" strokeLinecap="round" opacity=".8" />
      <path d="M104,196 L140,168 L166,182 L216,126" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M196,124 H218 V146" fill="none" stroke="#C5A059" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <g className="fill-lgl-sage"><circle cx="104" cy="196" r="4" /><circle cx="140" cy="168" r="4" /><circle cx="166" cy="182" r="4" /></g>
      <circle cx="270" cy="62" r="5" fill="#C5A059" />
    </svg>
  );
}

// Social media icon components
function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const milestones = [
  {
    year: "2021",
    Icon: CameraIcon,
    title: "The Inception",
    desc: "Little Giant Labs was founded in Mumbai by Rajesh Waghchaware with a simple belief: video content should be cinematic and tell stories that matter. Started with just a camera and a vision.",
  },
  {
    year: "2023",
    Icon: ChartIcon,
    title: "Creative Meets Performance",
    desc: "We realized that beautiful creative must drive business results. Integrated digital ads operations, data analytics, and performance funnels. Scaled our first major e-commerce client to 5x ROAS.",
  },
  {
    year: "2024",
    Icon: ChipIcon,
    title: "AI-Powered Systems",
    desc: "Pioneered AI-driven post-production workflows and CRM automation loops. We started helping clients run automated follow-ups and AI customer retention systems, making marketing fully autonomous.",
  },
  {
    year: "2026",
    Icon: GlobeIcon,
    title: "Global Compound Growth",
    desc: "Expanded into international markets. Today, Little Giant Labs serves 10+ brands globally, generating over 120M+ views annually, and engineering digital scale for industry leaders.",
  },
];

const values = [
  {
    title: "Story-First",
    Icon: FilmIcon,
    description: "Every pixel, frame, and syllable we write is built with intent. In a world of infinite scroll, only high-retention hooks and true storytelling break the noise."
  },
  {
    title: "Data-Driven Validation",
    Icon: ChartIcon,
    description: "Creativity is beautiful, but conversions are essential. We map growth funnels, audit metrics, and run scientific performance campaigns to multiply ROAS."
  },
  {
    title: "AI & Automation Compounding",
    Icon: LoopIcon,
    description: "We design custom workflow pipelines and CRM loops that automate the mundane, freeing up mindshare to focus entirely on high-leverage strategic creative."
  }
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"vision" | "background" | "philosophy">("vision");
  const timelineRef = useRef<HTMLDivElement>(null);

  // Set up scroll progress tracking for the timeline line animation
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const tabContents = {
    vision: {
      title: "To Build Digital Movements",
      body: "To create a world where brand storytelling is not just ads, but cinematic experiences that build deep-seated loyalty and community. Rajesh believes attention is the ultimate modern currency, and we must treat it with absolute respect by crafting high-value creative content.",
    },
    background: {
      title: "10+ Years of Directing Strategy",
      body: "With a strong background in visual communication and digital strategy, Rajesh has spent over a decade directing commercial video shoots, advising tech start-ups on growth, and developing cross-platform marketing architectures that unify content with automated funnels.",
    },
    philosophy: {
      title: "Performance is Creative Validation",
      body: "An ad shouldn't just look pretty; it must convert. By bridging the gap between high-end cinema cameras and analytics dashboards, we turn eyeballs into enterprise value. Data tells us what works; creativity tells us why it connects.",
    },
  };

  return (
    <main>
      {/* Page Header */}
      <PageHeader
        eyebrow="About Little Giant Labs"
        title="We build digital movements."
        description="Little Giant Labs sits at the intersection of high-retention cinematic storytelling and performance marketing, scaling brands that refuse to be ignored."
        theme="dark"
        visual={<AboutHeaderVisual />}
        style={{
          background: "var(--lgl-bg)",
          color: "var(--lgl-soft)",
          "--theme-bg": "var(--lgl-bg)",
          "--theme-fg": "var(--lgl-soft)",
          "--theme-fg-muted": "color-mix(in srgb, var(--lgl-soft) 80%, transparent)",
          "--theme-fg-subtle": "color-mix(in srgb, var(--lgl-soft) 72%, transparent)",
          "--theme-border": "color-mix(in srgb, var(--lgl-line) 18%, transparent)",
        } as CSSProperties}
      />

      {/* Founder Spotlight Section */}
      <Section
        theme="light"
        className="relative overflow-hidden border-b border-lgl-fg/10 py-20 md:py-28"
        style={{ background: "var(--lgl-section)", color: "var(--lgl-fg)" }}
      >
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.72fr)] lg:gap-20">
            <div className="flex flex-col">
              <div className="mb-8 flex items-center gap-4 border-b border-lgl-fg/15 pb-5">
                <span className="h-px w-10 bg-[#C5A059]" aria-hidden="true" />
                <p className="label-eyebrow text-lgl-fg/70">Our Leadership</p>
                <span className="ml-auto text-[0.68rem] tracking-[0.18em] text-lgl-fg/70">01 / THE POINT OF VIEW</span>
              </div>

              <h2 className="max-w-[12ch] text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-lgl-fg" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
                Storytelling <span className="font-light italic text-lgl-green-text">with conviction.</span>
              </h2>

              <p className="mt-8 max-w-[58ch] text-base leading-[1.8] text-lgl-fg/75 md:text-[1.05rem]">
                Rajesh Waghchaware founded Little Giant Labs on a simple premise: in a digital landscape flooded with media spend and generic assets, only the most calculated, cinematic campaigns command true attention.
              </p>

              <blockquote className="mt-8 max-w-[54ch] border-l-2 border-[#C5A059] pl-5 text-sm italic leading-[1.7] text-lgl-fg/75 md:text-base">
                &ldquo;Little Giant Labs represents bold ideas and focused execution. We channel that focus into the brands we scale.&rdquo;
                <cite className="mt-3 block text-[0.68rem] not-italic uppercase tracking-[0.2em] text-lgl-fg/70">Rajesh Waghchaware</cite>
              </blockquote>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-b border-lgl-fg/15">
                {(["vision", "background", "philosophy"] as const).map((tab) => {
                  const TabIcon = tabIcons[tab];
                  return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative inline-flex items-center gap-2 pb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lgl-gold"
                    style={{
                      color: activeTab === tab ? "var(--lgl-fg)" : "color-mix(in srgb, var(--lgl-fg) 70%, transparent)",
                      cursor: "pointer",
                    }}
                  >
                    <TabIcon size={14} className={activeTab === tab ? "text-[#C5A059]" : undefined} />
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059]"
                      />
                    )}
                  </button>
                  );
                })}
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 min-h-[150px] max-w-[58ch]"
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-lgl-fg" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
                  {tabContents[activeTab].title}
                </h3>
                <p className="mt-3 text-sm leading-[1.8] text-lgl-fg/65">
                  {tabContents[activeTab].body}
                </p>
              </motion.div>
            </div>

            <figure className="relative isolate mx-auto w-full max-w-[500px] lg:mt-12 lg:max-w-none">
              <div className="absolute -left-3 -top-3 h-full w-full border border-[#C5A059]/55" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden bg-[#0B1B2B]">
                <img
                  src="https://6xft9z0vzph7qrfh.public.blob.vercel-storage.com/media/founder/founder-f2ovW1aAw2yHLcv2XuCepudGIFnI91.jpg"
                  alt="Rajesh Waghchaware, Founder and Creative Director"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out motion-reduce:transition-none hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B2B]/90 via-[#0B1B2B]/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-[#E2E8F0] md:p-8">
                  <p className="label-eyebrow text-[#C5A059]">Founder &amp; Creative Director</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-3xl" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>Rajesh Waghchaware</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#E2E8F0]/80">Directing creative strategies, growth analytics pipelines, and cinematic production for high-growth brands globally.</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#E2E8F0]/20 pt-5">
                    <a href="https://linkedin.com/in/rajesh-waghchaware" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center border border-[#E2E8F0]/30 text-[#E2E8F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A059]" aria-label="LinkedIn"><LinkedInIcon /></a>
                    <a href="https://twitter.com/rajesh_w" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center border border-[#E2E8F0]/30 text-[#E2E8F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A059]" aria-label="Twitter/X"><TwitterIcon /></a>
                    <a href="https://www.instagram.com/bhairava.media/" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center border border-[#E2E8F0]/30 text-[#E2E8F0] transition-colors hover:border-[#C5A059] hover:text-[#C5A059] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A059]" aria-label="Instagram"><InstagramIcon /></a>
                  </div>
                </figcaption>
              </div>
            </figure>
          </div>
        </Container>
      </Section>

      {/* Interactive Milestone Timeline */}
      <Section theme="light" className="py-24 md:py-32 border-t border-lgl-fg/5 bg-lgl-section" ref={timelineRef}>
        <Container>
          <div className="mb-20 text-center max-w-xl mx-auto">
            <p className="label-eyebrow text-lgl-fg/65 mb-5">Our Journey</p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-lgl-fg" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
              Evolution in
              <br />
              <span className="font-light text-lgl-fg/70" style={{ fontStyle: "italic" }}>
                milestones.
              </span>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
            {/* Scroll-Progress Line (Desktop Center, Mobile Left) */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-lgl-line/15 -translate-x-[1px]" />
            <motion.div
              style={{
                scaleY,
                transformOrigin: "top",
              }}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-lgl-fg -translate-x-[1px] z-10"
            />

            {/* Timeline Cards */}
            <div className="space-y-16 md:space-y-24">
              {milestones.map((m, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={m.year}
                    className="relative flex flex-col md:flex-row items-start md:justify-between group"
                  >
                    {/* Circle Node Indicator */}
                    <div className="absolute left-4 md:left-1/2 top-0 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-lgl-section bg-lgl-fg text-lgl-section shadow-[0_0_0_1px_rgba(197,160,89,0.55)] transition-all duration-300 group-hover:scale-110 group-hover:text-[#C5A059]">
                      <m.Icon size={16} />
                    </div>

                    {/* Timeline Content Block (Alternates Left / Right on Desktop) */}
                    <div
                      className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? "md:text-right md:order-1" : "md:order-2"
                        }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: index * 0.05 }}
                      >
                        <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-lgl-fg/70 block mb-2" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
                          {m.year}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-lgl-fg" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
                          {m.title}
                        </h3>
                        <p className="mt-3 text-xs md:text-sm leading-relaxed text-lgl-fg/70 font-light">
                          {m.desc}
                        </p>
                      </motion.div>
                    </div>

                    {/* Empty spacer block for desktop symmetry */}
                    <div className="hidden md:block w-[45%] md:order-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Capabilities Section */}
      <Section theme="light" className="border-t border-lgl-fg/5 py-24 md:py-32" style={{ background: "var(--lgl-section)" }}>
        <Container>
          <div className="mb-16">
            <p className="label-eyebrow text-lgl-fg/65 mb-5">Our Capabilities</p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-lgl-fg" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
              How we scale
              <br />
              <span className="font-light text-lgl-fg/70" style={{ fontStyle: "italic" }}>
                your brand.
              </span>
            </h2>
          </div>
          <ServiceGrid />
        </Container>
      </Section>

      {/* Our Values Section */}
      <Section theme="light" className="border-t border-lgl-fg/5 py-24 md:py-32">
        <Container>
          <div className="mb-16 text-center max-w-xl mx-auto">
            <p className="label-eyebrow text-lgl-fg/65 mb-5">Our Principles</p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-lgl-fg" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
              Driven by
              <br />
              <span className="font-light text-lgl-fg/70" style={{ fontStyle: "italic" }}>
                conviction.
              </span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Card key={v.title} className="flex flex-col justify-between p-8 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-lgl-fg/20 transition-all duration-300">
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-2xl font-bold text-lgl-fg/70 tracking-tighter block">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-lgl-gold">
                      <v.Icon size={20} />
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-lgl-fg tracking-tight" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
                    {v.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-lgl-fg/70 font-light">
                    {v.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
