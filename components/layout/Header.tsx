"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";

export function Header() {
  const pathname = usePathname();
  const { dict, locale } = useI18n();

  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSectionHref, setActiveSectionHref] = useState<string | null>(null);

  const homePath = getLocalizedPath("/", locale);
  const isHomePage = pathname === "/" || pathname === `/${locale}`;

  const navItems = [
    { label: dict.nav.home, href: homePath },
    { label: dict.nav.services, href: `${homePath === "/" ? "" : homePath}#services` },
    { label: dict.nav.ourWork, href: `${homePath === "/" ? "" : homePath}#our-work` },
    { label: dict.nav.aboutUs, href: getLocalizedPath("/about", locale) },
    { label: dict.nav.contact, href: getLocalizedPath("/contact", locale) },
  ];

  const ctaHref = getLocalizedPath("/contact", locale);
  const activeHref = isHomePage ? activeSectionHref ?? homePath : pathname;

  /* Fade in on mount */
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Keep homepage hash links in sync with viewport activation */
  useEffect(() => {
    if (!isHomePage) return;

    const sections = [
      { id: "services", href: `${homePath === "/" ? "" : homePath}#services` },
      { id: "our-work", href: `${homePath === "/" ? "" : homePath}#our-work` },
    ]
      .map(({ id, href }) => ({ href, element: document.getElementById(id) }))
      .filter((section): section is { href: string; element: HTMLElement } => Boolean(section.element));

    let frame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.4;
        const current = sections.find(({ element }) => {
          const bounds = element.getBoundingClientRect();
          return bounds.top <= line && bounds.bottom > line;
        });
        setActiveSectionHref(current?.href ?? null);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [isHomePage, homePath]);

  /* Theme styling values */
  const pillBg = scrolled ? "var(--lgl-nav-pill-scrolled)" : "var(--lgl-nav-pill)";
  const pillBorder = scrolled ? "var(--lgl-nav-border-scrolled)" : "var(--lgl-nav-border)";
  const fgColor = "var(--lgl-nav-fg)";
  const fgMuted = "var(--lgl-nav-muted)";

  return (
    <>
      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* Floating pill container */}
        <div
          className="mx-4 mt-4 w-full transition-all duration-500"
          style={{ maxWidth: 1320 }}
        >
          <div
            className="flex items-center justify-between gap-4 md:gap-6 rounded-[100px] transition-all duration-500"
            style={{
              background: pillBg,
              border: `1px solid ${pillBorder}`,
              backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px)",
              WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px)",
              padding: scrolled ? "0.6rem 1.25rem 0.6rem 1.5rem" : "0.75rem 1.5rem 0.75rem 1.75rem",
              boxShadow: scrolled ? "var(--lgl-nav-shadow)" : "none",
            }}
          >
            {/* Wordmark + Icon Logo */}
            <Link
              href={homePath}
              className="shrink-0 flex translate-x-1 items-center gap-3 transition-opacity hover:opacity-75 group"
            >
              <Image
                src="/logo.png"
                alt="Little Giant Labs logo"
                width={80}
                height={80}
                priority
                className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className="hidden sm:inline"
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: fgColor,
                }}
              >
                {siteConfig.name}
              </span>
            </Link>

            {/* Desktop nav — center */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setActiveSectionHref(item.href.includes("#") ? item.href : null)}
                    className="localized-ui-text relative rounded-full transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: isActive ? fgColor : fgMuted,
                      padding: "0.4rem 0.85rem",
                      background: isActive ? "var(--lgl-nav-active)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = fgColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = fgMuted;
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: theme toggle + CTA + language selector + hamburger */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <ThemeToggle />

              {/* CTA pill button — desktop */}
              <Link
                href={ctaHref}
                className="localized-ui-text lgl-gold-cta hidden xl:inline-flex items-center rounded-full transition-all duration-300"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "0.4rem 1rem",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.82";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                }}
              >
                {dict.nav.cta}
              </Link>

              {/* Language Selector: immediately after CTA button */}
              <div className="hidden sm:inline-flex">
                <LanguageSelector variant="header" />
              </div>

              {/* Hamburger — mobile/tablet */}
              <button
                className="xl:hidden flex flex-col items-center justify-center gap-[5px] w-11 h-11 rounded-full transition-all duration-200"
                style={{
                  background: "var(--lgl-nav-chip)",
                  border: `1px solid ${pillBorder}`,
                }}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={dict.nav.toggleMenu}
              >
                <span
                  className="block rounded-full transition-all duration-300 origin-center"
                  style={{
                    width: 16,
                    height: 1.5,
                    background: fgColor,
                    transform: mobileOpen ? "rotate(45deg) translateY(3.5px)" : "none",
                  }}
                />
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: 16,
                    height: 1.5,
                    background: fgColor,
                    opacity: mobileOpen ? 0 : 1,
                  }}
                />
                <span
                  className="block rounded-full transition-all duration-300 origin-center"
                  style={{
                    width: 16,
                    height: 1.5,
                    background: fgColor,
                    transform: mobileOpen ? "rotate(-45deg) translateY(-3.5px)" : "none",
                  }}
                />
              </button>
            </div>
          </div>

          {/* ── MOBILE DROPDOWN ─────────────────────────────────────── */}
          <div
            className="xl:hidden overflow-hidden transition-all duration-400 ease-out"
            style={{
              maxHeight: mobileOpen ? 600 : 0,
              opacity: mobileOpen ? 1 : 0,
            }}
          >
            <div
              className="mt-2 rounded-[24px] px-5 py-4 flex flex-col gap-1"
              style={{
                background: "var(--lgl-nav-menu)",
                border: `1px solid ${pillBorder}`,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setActiveSectionHref(item.href.includes("#") ? item.href : null);
                      setMobileOpen(false);
                    }}
                    className="localized-ui-text rounded-[14px] px-4 py-3 transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: isActive ? fgColor : fgMuted,
                      background: isActive ? "var(--lgl-nav-chip)" : "transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-2 pt-3" style={{ borderTop: `1px solid ${pillBorder}` }}>
                <Link
                  href={ctaHref}
                  onClick={() => setMobileOpen(false)}
                  className="localized-ui-text lgl-gold-cta block text-center rounded-full py-2.5 transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {dict.nav.cta}
                </Link>
              </div>

              {/* Language Selector in mobile navigation */}
              <LanguageSelector variant="mobile" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
