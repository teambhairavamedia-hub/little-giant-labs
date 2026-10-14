"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { Section } from "@/components/ui/Section";

export function Footer() {
  const pathname = usePathname();
  const [localTime, setLocalTime] = useState("");
  const isContactPage = pathname === "/contact";

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
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: "#800000" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 pt-24 pb-8 md:px-10 lg:px-14">
        
        {/* Massive Hero CTA */}
        {!isContactPage && (
          <div className="mb-24">
            <Link
              href="/contact"
              className="group inline-flex flex-col items-start gap-4 text-left"
            >
              <p className="label-eyebrow text-white/30 tracking-[0.28em]">
                Start the Conversation
              </p>
              <h2
                className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-white transition-colors duration-500 group-hover:text-white/80"
                style={{ fontFamily: "var(--font-syne), sans-serif" }}
              >
                Let's create
                <br />
                something bold.
                <span className="inline-block ml-4 translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:-translate-y-2">
                  →
                </span>
              </h2>
            </Link>
          </div>
        )}

        {/* Separator line */}
        <div className="h-[1px] w-full bg-white/5 mb-16" />

        {/* Links & Info Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 items-start mb-28">
          
          {/* Col 1: Brand details */}
          <div className="col-span-2 md:col-span-1 max-w-xs">
            <div className="flex items-center gap-3 mb-1">
              <Image
                src="/favicon.svg"
                alt="Bhairava Media Logo"
                width={44}
                height={44}
                className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-full shadow-md"
              />
              <p
                className="text-[0.875rem] font-bold uppercase tracking-[0.22em] text-white"
                style={{ fontFamily: "var(--font-syne), sans-serif" }}
              >
                {siteConfig.name}
              </p>
            </div>
            <p className="mt-4 text-[0.8125rem] leading-[1.7] text-white/80 font-normal">
              Cinematic creative and performance growth engine for scaling brands.
            </p>
          </div>

          {/* Col 2: Navigation Menu */}
          <div className="flex flex-col gap-3">
            <p className="label-eyebrow text-white/60 mb-2 font-semibold">Navigation</p>
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.8125rem] font-medium text-white/80 transition-colors hover:text-white"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Col 3: Social/Connect */}
          <div className="flex flex-col gap-3">
            <p className="label-eyebrow text-white/60 mb-2 font-semibold">Connect</p>
            <a
              href={`mailto:${siteConfig.email ?? "hello@bhairavamedia.com"}`}
              className="text-[0.8125rem] font-medium text-white/50 transition-colors hover:text-white"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              Email
            </a>
            <a
              href={siteConfig.social?.instagram ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.8125rem] font-medium text-white/50 transition-colors hover:text-white"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              Instagram
            </a>
            <a
              href={siteConfig.social?.linkedin ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.8125rem] font-medium text-white/50 transition-colors hover:text-white"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              LinkedIn
            </a>
                        <a
              href={siteConfig.social?.twitter ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.8125rem] font-medium text-white/50 transition-colors hover:text-white"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              X
            </a>

          </div>


          {/* Col 4: Location & Local Time */}
          <div className="flex flex-col gap-2">
            <p className="label-eyebrow text-white/20 mb-2">Office</p>
            <p className="text-[0.8125rem] font-medium text-white/80" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              PUNE, IN
            </p>
            {localTime && (
              <p className="text-[0.75rem] font-medium text-white/35 tabular-nums mt-1" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                Local Time: {localTime}
              </p>
            )}
          </div>

        </div>

        {/* Bottom copyright & compliance */}
        <div className="relative pt-8 border-t border-white/5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between z-10">
          <p className="label-eyebrow text-white/20">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="label-eyebrow text-white/20">
            Engineered for motion, story, and scale.
          </p>
        </div>

        {/* Giant Watermark Background Logo */}
        <div
          className="absolute left-1/2 bottom-[-15%] -translate-x-1/2 pointer-events-none select-none text-center w-full z-0 overflow-hidden"
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(6rem, 16vw, 15rem)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.012)",
            textTransform: "uppercase",
            lineHeight: 0.8,
            whiteSpace: "nowrap",
          }}
        >
          BHAIRAVA
        </div>

      </div>
    </Section>
  );
}
