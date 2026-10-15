"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";


export function Header() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Fade in on mount (the homepage intro that used to gate this was removed) */
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
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  /* Colors come from the site theme (see --lgl-nav-* in globals.css) + scroll state */
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
            className="flex items-center justify-between gap-6 rounded-[100px] transition-all duration-500"
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
              href="/"
              className="shrink-0 flex items-center gap-3 transition-opacity hover:opacity-75 group"
            >
              <Image
                src="/logo.png"
                alt="Little Giant Labs logo"
                width={48}
                height={48}
                priority
                className="w-11 h-11 md:w-12 md:h-12 object-contain rounded-full shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span
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
              {siteConfig.nav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative rounded-full transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: isActive ? fgColor : fgMuted,
                      padding: "0.45rem 1rem",
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

            {/* Right side: theme toggle + CTA + hamburger */}
            <div className="flex items-center gap-3 shrink-0">
              <ThemeToggle />

              {/* CTA pill button — desktop */}
              <Link
                href={siteConfig.cta.href}
                className="lgl-gold-cta hidden xl:inline-flex items-center rounded-full transition-all duration-300"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "0.55rem 1.25rem",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.82";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                }}
              >
                {siteConfig.cta.label}
              </Link>

              {/* Hamburger — mobile/tablet */}
              <button
                className="xl:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 rounded-full transition-all duration-200"
                style={{
                  background: "var(--lgl-nav-chip)",
                  border: `1px solid ${pillBorder}`,
                }}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <span
                  className="block rounded-full transition-all duration-300 origin-center"
                  style={{
                    width: 14,
                    height: 1.5,
                    background: fgColor,
                    transform: mobileOpen ? "rotate(45deg) translateY(3.5px)" : "none",
                  }}
                />
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: 14,
                    height: 1.5,
                    background: fgColor,
                    opacity: mobileOpen ? 0 : 1,
                  }}
                />
                <span
                  className="block rounded-full transition-all duration-300 origin-center"
                  style={{
                    width: 14,
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
              maxHeight: mobileOpen ? 400 : 0,
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
              {siteConfig.nav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[14px] px-4 py-3 transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "0.8125rem",
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
                  href={siteConfig.cta.href}
                  className="lgl-gold-cta block text-center rounded-full py-3 transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {siteConfig.cta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
