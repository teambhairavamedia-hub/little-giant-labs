"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

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
    title: "The Inception",
    desc: "Bhairava Media was founded in Mumbai by Rajesh Waghchaware with a simple belief: video content should be cinematic and tell stories that matter. Started with just a camera and a vision.",
  },
  {
    year: "2023",
    title: "Creative Meets Performance",
    desc: "We realized that beautiful creative must drive business results. Integrated digital ads operations, data analytics, and performance funnels. Scaled our first major e-commerce client to 5x ROAS.",
  },
  {
    year: "2024",
    title: "AI-Powered Systems",
    desc: "Pioneered AI-driven post-production workflows and CRM automation loops. We started helping clients run automated follow-ups and AI customer retention systems, making marketing fully autonomous.",
  },
  {
    year: "2026",
    title: "Global Compound Growth",
    desc: "Expanded into international markets. Today, Bhairava Media serves 10+ brands globally, generating over 120M+ views annually, and engineering digital scale for industry leaders.",
  },
];

const values = [
  {
    title: "Story-First",
    description: "Every pixel, frame, and syllable we write is built with intent. In a world of infinite scroll, only high-retention hooks and true storytelling break the noise."
  },
  {
    title: "Data-Driven Validation",
    description: "Creativity is beautiful, but conversions are essential. We map growth funnels, audit metrics, and run scientific performance campaigns to multiply ROAS."
  },
  {
    title: "AI & Automation Compounding",
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
        eyebrow="About Bhairava Media"
        title="We build digital movements."
        description="Bhairava Media sits at the intersection of high-retention cinematic storytelling and performance marketing, scaling brands that refuse to be ignored."
        theme="dark"
      />

      {/* Founder Spotlight Section */}
      <Section theme="light" className="relative overflow-hidden py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-stretch">

            {/* Founder Visual & Social Card */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#e4e4e7] bg-[#0a0a0a] shadow-2xl flex flex-col justify-end p-8 md:p-12 min-h-[450px] lg:min-h-[550px] group">
              {/* Founder Image */}
              <img
                src="https://6xft9z0vzph7qrfh.public.blob.vercel-storage.com/media/founder/founder-f2ovW1aAw2yHLcv2XuCepudGIFnI91.jpg"
                alt="Rajesh Waghchaware - Founder & Creative Director"
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700 ease-out z-0"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10" />

              <div className="relative z-20 text-white flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 border border-white/20 rounded-full px-4 py-1.5 backdrop-filter backdrop-blur-md bg-black/40">
                    Founder Profile
                  </span>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                    Rajesh Waghchaware
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm font-semibold tracking-wider uppercase mt-1">
                    Founder &amp; Creative Director
                  </p>
                  <p className="mt-4 text-sm text-white/85 font-light leading-relaxed max-w-md">
                    Directing creative strategies, growth analytics pipelines, and cinematic production for high-growth brands globally.
                  </p>

                  {/* Quick Socials */}
                  <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-4">
                    <a
                      href="https://linkedin.com/in/rajesh-waghchaware"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-black/40 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 backdrop-blur-md"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon />
                    </a>
                    <a
                      href="https://twitter.com/rajesh_w"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-black/40 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 backdrop-blur-md"
                      aria-label="Twitter/X"
                    >
                      <TwitterIcon />
                    </a>
                    <a
                      href="https://www.instagram.com/bhairava.media/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-black/40 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 backdrop-blur-md"
                      aria-label="Instagram"
                    >
                      <InstagramIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Philosophy & Interactive Tabs */}
            <div className="flex flex-col justify-center">
              <p className="label-eyebrow text-[#0a0a0a]/38 mb-5">Our Leadership</p>
              <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-[#0a0a0a]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                Storytelling
                <br />
                <span className="font-light text-[#0a0a0a]/22" style={{ fontStyle: "italic" }}>
                  with conviction.
                </span>
              </h2>

              <p className="mt-6 text-[0.9375rem] leading-[1.75] text-[#0a0a0a]/65 font-light">
                Rajesh Waghchaware founded Bhairava Media on a simple premise: in a digital landscape flooded with media spend and generic assets, only the most calculated, cinematic campaigns command true attention.
              </p>

              {/* Interactive Tabs Menu */}
              <div className="mt-10 flex border-b border-theme pb-2 gap-6 md:gap-8">
                {(["vision", "background", "philosophy"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative pb-3 text-xs uppercase tracking-wider font-bold transition-colors duration-300"
                    style={{
                      color: activeTab === tab ? "#0a0a0a" : "rgba(10,10,10,0.35)",
                      cursor: "pointer",
                    }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#800000]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tabs Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 min-h-[160px]"
              >
                <h4 className="text-lg font-bold text-[#0a0a0a]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                  {tabContents[activeTab].title}
                </h4>
                <p className="mt-4 text-[0.9375rem] leading-[1.7] text-[#0a0a0a]/60 font-light">
                  {tabContents[activeTab].body}
                </p>
              </motion.div>

              <blockquote className="mt-8 border-l-2 border-[#0a0a0a]/15 pl-5 italic text-[0.9375rem] leading-[1.6] text-[#0a0a0a]/75 font-light">
                &ldquo;Bhairava represents power and focus. We channel that same focus into the brands we scale.&rdquo;
                <cite className="block mt-2 text-[10px] uppercase tracking-wider text-[#0a0a0a]/40 not-italic font-semibold">
                  — Rajesh Waghchaware
                </cite>
              </blockquote>
            </div>

          </div>
        </Container>
      </Section>

      {/* Interactive Milestone Timeline */}
      <Section theme="light" className="py-24 md:py-32 border-t border-[#0a0a0a]/5 bg-[#fbfbfb]" ref={timelineRef}>
        <Container>
          <div className="mb-20 text-center max-w-xl mx-auto">
            <p className="label-eyebrow text-[#0a0a0a]/38 mb-5">Our Journey</p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-[#0a0a0a]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Evolution in
              <br />
              <span className="font-light text-[#0a0a0a]/22" style={{ fontStyle: "italic" }}>
                milestones.
              </span>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
            {/* Scroll-Progress Line (Desktop Center, Mobile Left) */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#e4e4e7] -translate-x-[1px]" />
            <motion.div
              style={{
                scaleY,
                transformOrigin: "top",
              }}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#0a0a0a] -translate-x-[1px] z-10"
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
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-2 border-white bg-[#0a0a0a] -translate-x-1/2 top-1.5 z-20 transition-all duration-300 group-hover:scale-125" />

                    {/* Timeline Content Block (Alternates Left / Right on Desktop) */}
                    <div
                      className={`w-full md:w-[45%] pl-10 md:pl-0 ${isEven ? "md:text-right md:order-1" : "md:order-2"
                        }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: index * 0.05 }}
                      >
                        <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0a0a0a]/20 block mb-2" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                          {m.year}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-[#0a0a0a]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                          {m.title}
                        </h3>
                        <p className="mt-3 text-xs md:text-sm leading-relaxed text-[#0a0a0a]/50 font-light">
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
      <Section theme="light" className="border-t border-[#0a0a0a]/5 py-24 md:py-32" style={{ background: "#fafafa" }}>
        <Container>
          <div className="mb-16">
            <p className="label-eyebrow text-[#0a0a0a]/38 mb-5">Our Capabilities</p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-[#0a0a0a]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              How we scale
              <br />
              <span className="font-light text-[#0a0a0a]/22" style={{ fontStyle: "italic" }}>
                your brand.
              </span>
            </h2>
          </div>
          <ServiceGrid />
        </Container>
      </Section>

      {/* Our Values Section */}
      <Section theme="light" className="border-t border-[#0a0a0a]/5 py-24 md:py-32">
        <Container>
          <div className="mb-16 text-center max-w-xl mx-auto">
            <p className="label-eyebrow text-[#0a0a0a]/38 mb-5">Our Principles</p>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-[#0a0a0a]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              Driven by
              <br />
              <span className="font-light text-[#0a0a0a]/22" style={{ fontStyle: "italic" }}>
                conviction.
              </span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Card key={v.title} className="flex flex-col justify-between p-8 hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:border-[#0a0a0a]/20 transition-all duration-300">
                <div>
                  <span className="text-2xl font-bold text-[#0a0a0a]/15 tracking-tighter block mb-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-[#0a0a0a] tracking-tight" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                    {v.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#0a0a0a]/60 font-light">
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
