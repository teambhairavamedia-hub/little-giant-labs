"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { localeDetails, locales, type Locale } from "@/lib/i18n/config";

function GlobeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function LanguageSelector({ variant = "header" }: { variant?: "header" | "mobile" }) {
  const { locale, switchLocale, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const currentInfo = localeDetails[locale] || localeDetails.en;

  if (variant === "mobile") {
    return (
      <div className="mt-2 pt-3 border-t border-[var(--lgl-nav-border)]">
        <p className="localized-ui-text px-2 mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[var(--lgl-nav-muted)]">
          {dict.nav.language}
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {locales.map((code) => {
            const info = localeDetails[code];
            const isSelected = code === locale;
            return (
              <button
                key={code}
                type="button"
                onClick={() => switchLocale(code)}
                aria-pressed={isSelected}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-left transition-all duration-200"
                style={{
                  background: isSelected ? "var(--lgl-nav-chip)" : "transparent",
                  border: isSelected
                    ? "1px solid var(--lgl-gold)"
                    : "1px solid var(--lgl-nav-border)",
                  color: isSelected ? "var(--lgl-nav-fg)" : "var(--lgl-nav-muted)",
                }}
              >
                <div className="flex flex-col">
                  <span
                    className="localized-ui-text text-[0.8125rem] font-medium leading-tight"
                    style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                  >
                    {info.name}
                  </span>
                  <span className="text-[0.625rem] opacity-70 tracking-wider uppercase">
                    {info.englishName}
                  </span>
                </div>
                {isSelected && <CheckIcon className="w-3.5 h-3.5 text-lgl-gold shrink-0 ml-1.5" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={dict.nav.selectLanguage}
        className="inline-flex items-center gap-2 rounded-full h-11 px-3.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lgl-gold cursor-pointer"
        style={{
          background: "var(--lgl-nav-chip)",
          border: "1px solid var(--lgl-nav-border)",
          color: "var(--lgl-nav-fg)",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}
      >
        <GlobeIcon className="w-4 h-4 text-lgl-gold shrink-0" />
        <span className="localized-ui-text text-[0.6875rem] font-semibold uppercase tracking-[0.16em]">
          {currentInfo.name}
        </span>
        <ChevronDownIcon
          className={`w-3 h-3 opacity-70 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={dict.nav.selectLanguage}
          className="absolute right-0 mt-2 w-52 rounded-2xl p-1.5 shadow-2xl z-50 transition-all duration-200 ease-out"
          style={{
            background: "var(--lgl-nav-menu)",
            border: "1px solid var(--lgl-nav-border)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
          }}
        >
          {locales.map((code) => {
            const info = localeDetails[code];
            const isSelected = code === locale;
            return (
              <button
                key={code}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => {
                  switchLocale(code);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors duration-150 cursor-pointer group"
                style={{
                  background: isSelected ? "var(--lgl-nav-chip)" : "transparent",
                  color: isSelected ? "var(--lgl-nav-fg)" : "var(--lgl-nav-muted)",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--lgl-nav-fg)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "color-mix(in srgb, var(--lgl-nav-chip) 50%, transparent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--lgl-nav-muted)";
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }
                }}
              >
                <div className="flex flex-col">
                  <span
                    className="localized-ui-text text-[0.8125rem] font-semibold leading-snug"
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      color: isSelected ? "var(--lgl-gold)" : undefined,
                    }}
                  >
                    {info.name}
                  </span>
                  <span className="text-[0.625rem] opacity-65 tracking-wider uppercase font-medium">
                    {info.englishName}
                  </span>
                </div>
                {isSelected && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-lgl-gold/15 text-lgl-gold">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
