"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import {
  DEFAULT_COLOR_THEME,
  getColorTheme,
  subscribeColorTheme,
} from "@/lib/theme";
import {
  CALENDLY_BASE_URL,
  CALENDLY_THEME_CONFIG,
  buildCalendlyUrl,
} from "@/lib/calendly";

export { CALENDLY_BASE_URL, CALENDLY_THEME_CONFIG, buildCalendlyUrl };

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

export function CalendlyWidget() {
  const theme = useSyncExternalStore(
    subscribeColorTheme,
    getColorTheme,
    () => DEFAULT_COLOR_THEME
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const lastUrlRef = useRef<string | null>(null);

  const url = buildCalendlyUrl(theme);

  // If window.Calendly is already on the page (e.g. client-side navigation), record script as loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.Calendly) {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tryInit = (): boolean => {
      if (typeof window !== "undefined" && window.Calendly) {
        if (lastUrlRef.current === url && container.querySelector("iframe")) {
          return true;
        }
        container.innerHTML = "";
        window.Calendly.initInlineWidget({
          url,
          parentElement: container,
        });
        lastUrlRef.current = url;
        return true;
      }
      return false;
    };

    if (tryInit()) {
      return () => {
        container.innerHTML = "";
        lastUrlRef.current = null;
      };
    }

    // If script has loaded or is loading, poll briefly until window.Calendly is attached
    let intervalId: NodeJS.Timeout | null = null;
    let attempts = 0;
    intervalId = setInterval(() => {
      attempts++;
      if (tryInit() || attempts >= 40) {
        if (intervalId) clearInterval(intervalId);
      }
    }, 50);

    return () => {
      if (intervalId) clearInterval(intervalId);
      container.innerHTML = "";
      lastUrlRef.current = null;
    };
  }, [url, scriptLoaded]);

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden">
      <Script
        id="calendly-widget-script"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
        }}
      />
      <div
        ref={containerRef}
        className="calendly-inline-widget w-full"
        data-url={url}
        style={{ minWidth: "320px", height: "700px", width: "100%" }}
      />
    </div>
  );
}
