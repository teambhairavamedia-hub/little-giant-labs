"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";
import { ClockIcon, InstagramIcon, LinkedInIcon, MailIcon, PinIcon, XIcon } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";

export function Footer() {
  const { dict, locale } = useI18n();
  const [localTime, setLocalTime] = useState("");
  const reduceMotion = useReducedMotion();

  const taglineWords = dict.footer.brandTagline.trim().split(/\s+/);
  const taglineAccent = taglineWords.pop();
  const wordReveal = { hidden: { opacity: 0, y: "0.45em", filter: "blur(6px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } };
  const wordTransition = { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const };

  const contactHref = getLocalizedPath("/contact", locale);
  const homePath = getLocalizedPath("/", locale);

  // Phones and tablets follow the mailto: link into their mail app. Desktops often have no mail app set up,
  // so they open a Gmail message in a new tab instead.
  const openEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    event.preventDefault();
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}`, "_blank", "noopener,noreferrer");
  };

  const navItems = [
    { label: dict.nav.home, href: homePath },
    // Same targets as the header: the Services page, and the homepage Our Work section from any page
    { label: dict.nav.services, href: getLocalizedPath("/services", locale) },
    { label: dict.nav.ourWork, href: `${homePath}#our-work` },
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
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-8 md:px-10 md:pt-20 lg:px-14 [&_.label-eyebrow]:text-[0.6875rem]">
        {/* Links & Info Columns */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3 md:gap-8 xl:grid-cols-5 items-start mb-14 md:mb-16">
          {/* Col 1: Brand statement card — the tagline rises in word by word, closed by a quote mark */}
          <motion.div
            className="relative col-span-2 overflow-hidden w-full max-w-lg rounded-3xl border border-lgl-gold/25 p-6 pb-10 sm:p-7 sm:pb-11 md:col-span-3 xl:col-span-2 xl:mr-10"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-5 select-none text-[4.5rem] leading-[0.75] text-lgl-gold/25 sm:right-6 sm:text-[5rem]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              &rdquo;
            </span>
            <p className="home-eyebrow relative" style={{ marginBottom: "1rem" }}>{siteConfig.name}</p>
            <motion.p
              className="relative max-w-[34ch] text-[1.0625rem] font-semibold leading-[1.4] tracking-[-0.02em] text-lgl-fg sm:text-[1.1875rem] xl:text-[1.25rem]"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              variants={{ visible: { transition: { delayChildren: 0.2, staggerChildren: 0.06 } } }}
            >
              {taglineWords.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  className="mr-[0.26em] inline-block"
                  variants={wordReveal}
                  transition={wordTransition}
                >
                  {word}
                </motion.span>
              ))}
              <motion.em
                className="lgl-tagline-accent inline-block text-[1.12em] font-normal tracking-[-0.01em]"
                style={{ fontFamily: "Georgia, serif" }}
                variants={wordReveal}
                transition={wordTransition}
              >
                {taglineAccent}
              </motion.em>
            </motion.p>
          </motion.div>

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
              href={`mailto:${siteConfig.email}`}
              onClick={openEmail}
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

          {/* Col 4: Location & Local Time — full row on mobile so the address doesn't wrap awkwardly */}
          <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
            <p className="label-eyebrow text-lgl-fg/70 mb-2">
              {dict.footer.officeHeading}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address.full)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2.5 text-[0.875rem] font-medium leading-[1.6] text-lgl-fg/80 transition-colors hover:text-lgl-fg"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              <PinIcon size={15} className="mt-[0.2rem] shrink-0 text-lgl-gold/80" />
              <address className="not-italic">
                <span className="block font-semibold text-lgl-fg">{siteConfig.address.building}</span>
                {siteConfig.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </a>
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
        <div className="relative pt-8 border-t border-lgl-fg/5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between z-10">
          <p className="footer-legal">
            © {new Date().getFullYear()} {dict.footer.copyright}
          </p>
          <p className="footer-legal">
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
