"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CopyableTableLinkProps {
  href: string;
  text: string;
  ariaLabel: string;
  title?: string;
  className: string;
  target?: string;
  rel?: string;
}

export function CopyableTableLink({
  href,
  text,
  ariaLabel,
  title,
  className,
  target,
  rel,
}: CopyableTableLinkProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(href);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = href;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }, [href]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative inline-flex max-w-full items-center gap-1.5">
      <a
        href={href}
        target={target}
        rel={rel}
        title={title ?? href}
        aria-label={ariaLabel}
        onClick={(e) => {
          e.preventDefault();
          void copyUrl();
        }}
        className={className}
      >
        {text}
      </a>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void copyUrl();
        }}
        aria-label={copied ? "Copied URL to clipboard" : `Copy link for ${text}`}
        title={copied ? "Copied!" : "Copy link"}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded p-1 text-[#6b6b6b] transition-colors hover:bg-neutral-100 hover:text-[#202020] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#800000]"
      >
        {copied ? (
          <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
      {copied && (
        <span
          role="status"
          className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-1.5 py-0.5 text-[11px] font-medium text-white shadow"
        >
          Copied!
        </span>
      )}
    </div>
  );
}
