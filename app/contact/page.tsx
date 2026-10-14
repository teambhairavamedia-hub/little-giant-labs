"use client";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

const faqs = [
  {
    q: "What types of brands do you work with?",
    a: "We work with ambitious brands across D2C, SaaS, hospitality, fashion, fitness, and fintech. If you have a product people love and want to scale it with cinematic storytelling and performance systems, we're a good fit.",
  },
  {
    q: "What's your typical engagement timeline?",
    a: "Most engagements start with a 2-week strategy phase, followed by a 90-day campaign sprint. We recommend a minimum 6-month partnership for compounding growth results.",
  },
  {
    q: "Do you handle both creative and media buying?",
    a: "Yes. We believe creative and performance should never be siloed. Our team handles everything from cinematic production and scripting to Meta/Google ad operations and CRM automation.",
  },
  {
    q: "What does pricing look like?",
    a: "We offer custom proposals based on scope. Typical monthly retainers range from ₹1.5L to ₹8L depending on the services mix. All engagements include a strategy session before any commitment.",
  },
];

export default function ContactPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <main>
      <PageHeader
        eyebrow="Get In Touch"
        title="Let's build your growth engine."
        description="Whether you need a full-stack creative partner or a targeted campaign sprint, we'd love to hear about your vision."
        theme="dark"
      />

      {/* Main Form + Info Split Layout */}
      <Section theme="light" className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start">
            
            {/* LEFT COLUMN: Sticky Info & Testimonial Panel */}
            <div className="lg:sticky lg:top-28 space-y-12">
              
              {/* Direct Communication Channels */}
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-widest text-black/35 font-bold block">
                  Direct Inquiries
                </span>
                
                {/* Email Link */}
                <div className="space-y-1">
                  <span className="text-[11px] text-black/40 font-light block">Partnerships & Strategy</span>
                  <a
                    href="mailto:hello@bhairavamedia.com"
                    className="text-lg md:text-xl font-bold text-black hover:text-[#d4af37] transition-colors duration-200 inline-block border-b border-black/10 pb-1"
                    style={{ fontFamily: "var(--font-syne), sans-serif" }}
                  >
                    hello@bhairavamedia.com
                  </a>
                </div>

                {/* Office Location */}
                <div className="space-y-1">
                  <span className="text-[11px] text-black/40 font-light block">Our Location</span>
                  <span
                    className="text-sm font-semibold text-black block"
                    style={{ fontFamily: "var(--font-syne), sans-serif" }}
                  >
                    PUNE, Maharashtra, IN
                  </span>
                </div>

                {/* Response Speed */}
                <div className="space-y-1">
                  <span className="text-[11px] text-black/40 font-light block">Response Time</span>
                  <span
                    className="text-sm font-semibold text-[#d4af37] block"
                    style={{ fontFamily: "var(--font-syne), sans-serif" }}
                  >
                    Within 24 hours
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-black/35 font-bold block">
                  Follow Our Process
                </span>
                <div className="flex gap-4">
                  {[
                    { label: "LinkedIn", url: siteConfig.social?.linkedin },
                    { label: "Twitter", url: siteConfig.social?.twitter },
                    { label: "Instagram", url: siteConfig.social?.instagram },
                  ].map((soc) => (
                    <a
                      key={soc.label}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-black/50 hover:text-black font-semibold uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    >
                      {soc.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Featured Client Story Card */}
              <div className="rounded-2xl border border-black/5 p-6 bg-[#fafafa] space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["#6366f1", "#ec4899", "#f59e0b"].map((bg, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[7px] text-white font-bold"
                        style={{ background: bg }}
                      >
                        {["RW", "AK", "SM"][idx]}
                      </div>
                    ))}
                  </div>
                  <span className="text-[8px] uppercase tracking-wider text-black/40 font-bold">
                    Trusted by 10+ brands
                  </span>
                </div>
                <blockquote className="text-xs text-black/60 leading-relaxed font-light italic">
                  &ldquo;Working with Bhairava felt like having an in-house creative and growth team. Absolutely recommend their strategy-first approach.&rdquo;
                </blockquote>
                <cite className="block text-[9px] uppercase tracking-wider text-black/35 not-italic font-bold">
                  — Founder, Nova Skincare
                </cite>
              </div>
            </div>

            {/* RIGHT COLUMN: Form & Accordion FAQs */}
            <div className="space-y-16">
              
              {/* Contact Form Section */}
              <div className="space-y-8">
                <div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-2"
                    style={{ fontFamily: "var(--font-syne), sans-serif" }}
                  >
                    Start a conversation
                  </h2>
                  <p className="text-xs text-black/45 font-light">
                    Complete the details below, and our creative team will formulate a custom growth strategy blueprint for your brand.
                  </p>
                </div>
                <ContactForm />
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-widest text-black/35 font-bold block">
                  Frequently Asked Questions
                </span>
                
                <div className="space-y-3">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="border-b border-black/5 pb-4 last:border-0"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between gap-4 text-left py-2 group"
                        >
                          <span
                            className="text-sm font-bold text-black group-hover:text-[#d4af37] transition-colors duration-200"
                            style={{ fontFamily: "var(--font-syne), sans-serif" }}
                          >
                            {faq.q}
                          </span>
                          <span className="text-xs text-black/30 group-hover:text-black">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="mt-2 text-xs leading-relaxed text-black/50 font-light pr-4">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </Container>
      </Section>
    </main>
  );
}
