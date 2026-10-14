import { siteConfig } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

type CTABannerProps = {
  theme?: "dark" | "light";
};

export function CTABanner({ theme = "dark" }: CTABannerProps) {
  return (
    <Section theme={theme}>
      <Container className="py-20 md:py-28">
        <div className="theme-glass rounded-[2.5rem] px-8 py-16 text-center md:px-16">
          {/* Noomo-style: giant editorial heading */}
          <h2
            className="text-[clamp(2.2rem,6vw,4.5rem)] font-bold tracking-[-0.04em] leading-[0.96]"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            Ready to grow
            <br />
            <span className="opacity-35">with clarity?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-[1.65] text-theme-muted font-light">
            High-converting agency sites end every page with a clear next step.
            Book a strategy call and let&apos;s build your growth engine.
          </p>
          <Button href={siteConfig.cta.href} variant="primary" className="mt-10">
            {siteConfig.cta.label}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
