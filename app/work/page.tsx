import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Work | Temporarily Unavailable",
  description: "The selected work section is temporarily unavailable.",
};

export default function WorkPage() {
  notFound();
  /* Temporarily disabled case studies page; preserve for restoration.
  return (
    <main>
      <PageHeader
        eyebrow="Selected Work"
        title="Stories that drive results."
        description="Every project is a system — strategy, creative, and performance working together. Hover to preview each campaign."
        theme="dark"
      />

      <Section theme="light">
        <Container className="py-16 md:py-20">
          <CaseStudyGrid />
        </Container>
      </Section>

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
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
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
  */
}
