"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { ClockIcon, InstagramIcon, LinkedInIcon, MailIcon, PinIcon, XIcon } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";

export function Footer() {
  const pathname = usePathname();
  const { dict, locale } = useI18n();
  const [localTime, setLocalTime] = useState("");

  const contactHref = getLocalizedPath("/contact", locale);
  const homePath = getLocalizedPath("/", locale);
  const isContactPage = pathname === "/contact" || pathname === `/${locale}/contact`;

  const navItems = [
    { label: dict.nav.home, href: homePath },
    { label: dict.nav.services, href: `${homePath === "/" ? "" : homePath}#services` },
    { label: dict.nav.ourWork, href: `${homePath === "/" ? "" : homePath}#our-work` },
    { label: dict.nav.aboutUs, href: getLocalizedPath("/about", locale) },
    { label: dict.nav.contact, href: contactHref },
  ];

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(new Date());
      setLocalTime(formatted + " IST");
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section
      theme="dark"
      className="relative overflow-hidden border-t border-lgl-fg/5"
      style={{ background: "var(--lgl-bg)", color: "var(--lgl-fg)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 pt-24 pb-8 md:px-10 lg:px-14 [&_.label-eyebrow]:text-[0.6875rem]">
        {/* Massive Hero CTA */}
        {!isContactPage && (
          <div className="mb-24">
            <Link
              href={contactHref}
              className="group inline-flex flex-col items-start gap-4 text-left"
            >
              <p className="label-eyebrow text-lgl-fg/70 tracking-[0.28em]">
                {dict.footer.ctaEyebrow}
              </p>
              <h2
                className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-lgl-fg transition-colors duration-500 group-hover:text-lgl-fg/80"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {dict.footer.ctaHeading1}
                <br />
                {dict.footer.ctaHeading2}
                <span className="inline-block ml-4 translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:-translate-y-2">
                  →
                </span>
              </h2>
            </Link>
          </div>
        )}

        {/* Separator line */}
        <div className="h-[1px] w-full bg-lgl-fg/5 mb-16" />

        {/* Links & Info Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 items-start mb-28">
          {/* Col 1: Brand details */}
          <div className="col-span-2 md:col-span-1 max-w-xs">
            <div className="flex items-center gap-3 mb-1">
              <Image
                src="/logo.png"
                alt="Little Giant Labs logo"
                width={44}
                height={44}
                className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-full shadow-md"
              />
              <p
                className="text-[0.9375rem] font-bold uppercase tracking-[0.22em] text-lgl-fg"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {siteConfig.name}
              </p>
            </div>
            <p className="mt-4 text-[0.875rem] leading-[1.7] text-lgl-fg/80 font-normal">
              {dict.footer.brandTagline}
            </p>
          </div>

          {/* Col 2: Navigation Menu */}
          <div className="flex flex-col gap-1">
            <p className="label-eyebrow text-lgl-fg/70 mb-2 font-semibold">
              {dict.footer.navHeading}
            </p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-8 items-center text-[0.875rem] font-medium text-lgl-fg/80 transition-colors hover:text-lgl-fg"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Col 3: Social/Connect */}
          <div className="flex flex-col gap-1">
            <p className="label-eyebrow text-lgl-fg/70 mb-2 font-semibold">
              {dict.footer.connectHeading}
            </p>
            <a
              href={`mailto:${siteConfig.email ?? "hello@bhairavamedia.com"}`}
              className="inline-flex min-h-8 items-center gap-2.5 text-[0.875rem] font-medium text-lgl-fg/75 transition-colors hover:text-lgl-fg"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              <MailIcon size={15} className="text-lgl-gold/80" />
              Email
            </a>
            <a
              href={siteConfig.social?.instagram ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-8 items-center gap-2.5 text-[0.875rem] font-medium text-lgl-fg/75 transition-colors hover:text-lgl-fg"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              <InstagramIcon size={15} className="text-lgl-gold/80" />
              Instagram
            </a>
            <a
              href={siteConfig.social?.linkedin ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-8 items-center gap-2.5 text-[0.875rem] font-medium text-lgl-fg/75 transition-colors hover:text-lgl-fg"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              <LinkedInIcon size={15} className="text-lgl-gold/80" />
              LinkedIn
            </a>
            <a
              href={siteConfig.social?.twitter ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-8 items-center gap-2.5 text-[0.875rem] font-medium text-lgl-fg/75 transition-colors hover:text-lgl-fg"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              <XIcon size={15} className="text-lgl-gold/80" />
              X
            </a>
          </div>

          {/* Col 4: Location & Local Time */}
          <div className="flex flex-col gap-2">
            <p className="label-eyebrow text-lgl-fg/70 mb-2">
              {dict.footer.officeHeading}
            </p>
            <p
              className="inline-flex items-center gap-2.5 text-[0.875rem] font-medium text-lgl-fg/80"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              <PinIcon size={15} className="text-lgl-gold/80" />
              {dict.footer.location}
            </p>
            {localTime && (
              <p
                className="inline-flex items-center gap-2.5 text-[0.8125rem] font-medium text-lgl-fg/70 tabular-nums mt-1"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                <ClockIcon size={15} className="text-lgl-gold/80" />
                {dict.footer.localTimePrefix} {localTime}
              </p>
            )}
          </div>
        </div>

        {/* Bottom copyright & compliance */}
        <div className="relative pt-8 border-t border-lgl-fg/5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between z-10">
          <p className="label-eyebrow text-lgl-fg/70">
            © {new Date().getFullYear()} {dict.footer.copyright}
          </p>
          <p className="label-eyebrow text-lgl-fg/70">
            {dict.footer.slogan}
          </p>
        </div>

        {/* Giant Watermark Background Logo */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 bottom-[-15%] -translate-x-1/2 pointer-events-none select-none text-center w-full z-0 overflow-hidden"
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: "clamp(6rem, 16vw, 15rem)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: "color-mix(in srgb, var(--lgl-fg) 1.5%, transparent)",
            textTransform: "uppercase",
            lineHeight: 0.8,
            whiteSpace: "nowrap",
          }}
        >
          LITTLE GIANT LABS
        </div>
      </div>
    </Section>
  );
}
