import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { CaseStudyGrid } from "@/components/work/CaseStudyGrid";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Work — Bhairava Media",
  description:
    "Selected case studies, brand campaigns, and performance results. See how we turn attention into revenue.",
};

export default function WorkPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Selected Work"
        title="Stories that drive results."
        description="Every project is a system — strategy, creative, and performance working together. Hover to preview each campaign."
        theme="dark"
      />

      {/* Case Study Grid */}
      <Section theme="light">
        <Container className="py-16 md:py-20">
          <CaseStudyGrid />
        </Container>
      </Section>

      {/* Results Marquee Banner */}
      <Section theme="dark" className="py-5 md:py-6 overflow-hidden border-t border-white/10" style={{ background: "#800000" }}>
        <div className="flex whitespace-nowrap gap-12 animate-[marquee-stats_20s_linear_infinite]">
          {[
            "120M+ Views Delivered",
            "₹4.5Cr+ Revenue Generated",
            "10+ Brands Scaled",
            "400% Average ROAS",
            "94% Client Retention",
            "850+ Campaigns Launched",
            "120M+ Views Delivered",
            "₹4.5Cr+ Revenue Generated",
            "10+ Brands Scaled",
            "400% Average ROAS",
          ].map((stat, i) => (
            <span
              key={i}
              className="text-sm md:text-base uppercase tracking-widest text-white/50 font-semibold shrink-0"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              {stat}
              <span className="mx-6 text-white/15">✦</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee-stats {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </Section>
    </main>
  );
}
