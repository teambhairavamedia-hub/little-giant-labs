"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useI18n } from "@/lib/i18n/context";
import { getLocalizedPath } from "@/lib/i18n/config";

export function Header() {
  const pathname = usePathname();
  const { dict, locale } = useI18n();

  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpenForPath, setMobileOpenForPath] = useState<string | null>(null);
  const [activeSectionHref, setActiveSectionHref] = useState<string | null>(null);

  const homePath = getLocalizedPath("/", locale);
  const isHomePage = pathname === "/" || pathname === `/${locale}`;
  const mobileOpen = mobileOpenForPath === pathname;

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

  /* Page-colored backdrop + compact logo once content scrolls beneath the fixed header */
  useEffect(() => {
    let frame = 0;
    const updateScrolled = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrolled);
    };
  }, []);

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
  const pillBorder = "var(--lgl-nav-border)";
  const fgColor = "var(--lgl-nav-fg)";
  const fgMuted = "var(--lgl-nav-muted)";

  /* Portrait mark (824×1072): one logo that smoothly shrinks to compact navbar size once scrolled */
  const logoClass = `w-auto max-w-full flex-none object-contain transition-[height,transform] duration-300 ease-out group-hover:scale-105 ${
    scrolled ? "h-[3.75rem] md:h-16 xl:h-[4.5rem]" : "h-[5.5rem] md:h-[6.25rem] xl:h-32"
  }`;

  return (
    <>
      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 ease-out ${
          scrolled || mobileOpen ? "bg-lgl-bg" : "bg-transparent"
        }`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div
          className="mx-4 mt-0 w-[calc(100%-2rem)] transition-all duration-500"
          style={{ maxWidth: 1400 }}
        >
          <div
            className={`lgl-header-pill grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 transition-all duration-300 sm:px-6 md:gap-6 md:px-8 min-[1280px]:grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] min-[1280px]:gap-6 min-[1280px]:px-10 ${
              scrolled ? "py-1 md:py-1.5" : "py-2 md:py-3"
            }`}
          >
            {/* Logo — left side; inset ~2cm further on desktop */}
            <Link
              href={homePath}
              aria-label="Little Giant Labs home"
              className="group col-start-1 row-start-1 flex w-max shrink-0 items-center justify-self-start transition-opacity hover:opacity-75 xl:ml-29"
            >
              <Image
                src="/new-logo-readable.png"
                alt="Little Giant Labs logo"
                width={824}
                height={1072}
                priority
                className={`logo-mark-light ${logoClass}`}
              />
              <Image
                src="/new-logo-readable-dark.png"
                alt=""
                aria-hidden="true"
                width={824}
                height={1072}
                priority
                className={`logo-mark-dark ${logoClass}`}
              />
            </Link>

            {/* Desktop nav — center */}
            <nav className="hidden min-[1280px]:col-start-2 min-[1280px]:row-start-1 min-[1280px]:flex min-[1280px]:items-center min-[1280px]:justify-self-center min-[1280px]:gap-1.5 min-[1280px]:whitespace-nowrap">
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
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: isActive ? fgColor : fgMuted,
                      padding: "0.35rem 0.65rem",
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
            <div className="col-start-2 row-start-1 flex shrink-0 items-center gap-2.5 justify-self-end sm:gap-3 min-[1280px]:col-start-3 min-[1280px]:gap-4">
              <ThemeToggle />

              {/* CTA pill button — desktop */}
              <Link
                href={ctaHref}
                className="localized-ui-text lgl-gold-cta hidden h-10 items-center justify-center rounded-full px-3 transition-all duration-300 sm:px-4 min-[1280px]:inline-flex"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
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
                className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full transition-all duration-200 hover:opacity-80 sm:h-10 sm:w-10 min-[1280px]:hidden"
                style={{
                  background: "var(--lgl-nav-chip)",
                  border: `1px solid ${pillBorder}`,
                }}
                onClick={() => setMobileOpenForPath((path) => path === pathname ? null : pathname)}
                aria-label={dict.nav.toggleMenu}
                aria-expanded={mobileOpen}
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
            className="overflow-hidden transition-all duration-400 ease-out min-[1280px]:hidden"
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
                      setMobileOpenForPath(null);
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
                  onClick={() => setMobileOpenForPath(null)}
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
