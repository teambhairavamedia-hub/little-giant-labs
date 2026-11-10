"use client";

import { useEffect, useRef } from "react";
import { TURNSTILE_ACTION } from "@/lib/turnstile";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { scriptPromise = null; reject(new Error("Turnstile could not load.")); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/* Cloudflare Turnstile "are you a robot?" check. Most visitors pass without doing anything; some are asked to tick a
   box. Reports a token when passed and null when it expires or fails. `resetKey` changes after each submission
   attempt, since a token can be used only once. */
export function TurnstileWidget({
  siteKey,
  onToken,
  resetKey,
  theme = "auto",
}: {
  siteKey: string;
  onToken: (token: string | null) => void;
  resetKey: number;
  theme?: "auto" | "light" | "dark";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => { onTokenRef.current = onToken; }, [onToken]);

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          action: TURNSTILE_ACTION,
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => onTokenRef.current(null));
    return () => {
      cancelled = true;
      if (widgetRef.current && window.turnstile) window.turnstile.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [siteKey, theme]);

  useEffect(() => {
    if (resetKey > 0 && widgetRef.current && window.turnstile) {
      window.turnstile.reset(widgetRef.current);
      onTokenRef.current(null);
    }
  }, [resetKey]);

  return <div ref={containerRef} className="min-h-[65px]" />;
}
