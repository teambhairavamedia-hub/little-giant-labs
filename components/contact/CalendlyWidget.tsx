"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import {
  DEFAULT_COLOR_THEME,
  getColorTheme,
  subscribeColorTheme,
} from "@/lib/theme";
import { CALENDLY_BASE_URL, buildCalendlyUrl } from "@/lib/calendly";

export { CALENDLY_BASE_URL, buildCalendlyUrl };

export const CALENDLY_INITIAL_HEIGHT = "850px";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        resize?: boolean;
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
  const [widgetHeight, setWidgetHeight] = useState<string>(CALENDLY_INITIAL_HEIGHT);
  const lastUrlRef = useRef<string | null>(null);

  // Tracks whether the user has advanced past the date/time picker into the
  // booking form. Once true, reinitializing the widget would erase their
  // selected slot and form entries, so we skip reinits until the session ends.
  const hasProgressRef = useRef(false);

  // The Calendly URL uses a single fixed palette, so it never changes when the
  // website theme changes. The iframe is therefore never recreated on a theme
  // toggle, preserving the user's selected date, time, and booking progress.
  const url = buildCalendlyUrl();

  // If window.Calendly is already on the page (e.g. client-side navigation), record script as loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.Calendly) {
      setScriptLoaded(true);
    }
  }, []);

  // Listen to Calendly's postMessage events for dynamic height adjustments and
  // booking-progress tracking.
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (typeof e.origin === "string" && !e.origin.includes("calendly.com")) {
        return;
      }
      if (!e.data || typeof e.data !== "object") return;

      if (e.data.event === "calendly.page_height" && e.data.payload?.height) {
        const height = Number(e.data.payload.height);
        if (!isNaN(height) && height > 0) {
          setWidgetHeight(`${height}px`);
        }
      }

      // The user selected a date/time and advanced to the booking form.
      // Lock reinits from this point to preserve their in-progress session.
      if (e.data.event === "calendly.date_and_time_selected") {
        hasProgressRef.current = true;
      }

      // Booking completed — safe to reinitialize for a fresh session.
      if (e.data.event === "calendly.event_scheduled") {
        hasProgressRef.current = false;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tryInit = (): boolean => {
      if (typeof window !== "undefined" && window.Calendly) {
        // Already showing the correct iframe — nothing to do.
        if (lastUrlRef.current === url && container.querySelector("iframe")) {
          return true;
        }
        // URL changed but the user is mid-booking. Preserve the session rather
        // than reload the iframe and erase their progress.
        if (hasProgressRef.current && container.querySelector("iframe")) {
          return true;
        }
        container.innerHTML = "";
        window.Calendly.initInlineWidget({
          url,
          parentElement: container,
          resize: true,
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
    <div className="w-full max-w-xl mx-auto overflow-x-clip">
      <Script
        id="calendly-widget-script"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
        }}
      />
      <div
        className="calendly-frame relative w-full overflow-x-hidden rounded-2xl border border-lgl-line/20 bg-lgl-bg shadow-sm transition-colors duration-200"
        data-theme={theme}
      >
        <div
          ref={containerRef}
          className="calendly-inline-widget w-full transition-[height] duration-200"
          data-url={url}
          data-resize="true"
          style={{
            minWidth: "320px",
            height: widgetHeight,
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}
