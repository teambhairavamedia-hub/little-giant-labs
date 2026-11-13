"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/* Eased smooth scrolling (Lenis) for the whole site. Lenis runs its own animation frame loop (`autoRaf`): no page
   uses GSAP ScrollTrigger, so GSAP is not loaded just to drive it (that saved about 57 KB of JavaScript per page). */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure browser does not restore stale scroll positions on refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const onPageHide = () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    };
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("beforeunload", onPageHide);

    // Respect reduced-motion: keep native scrolling instead of eased smooth scroll
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
      return () => {
        window.removeEventListener("pagehide", onPageHide);
        window.removeEventListener("beforeunload", onPageHide);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      // Smoothly scroll in-page links such as "Explore Our Work" → #our-work
      anchors: true,
      autoRaf: true,
    });
    lenisRef.current = lenis;

    // Handle initial scroll state on load / refresh:
    // If a specific section target is in the URL hash, scroll to it; otherwise load from the top.
    const initialHash = window.location.hash;
    if (initialHash) {
      const targetElement = document.querySelector(initialHash);
      if (targetElement) {
        requestAnimationFrame(() => {
          lenis.scrollTo(initialHash, { offset: 0, duration: 1 });
        });
      }
    } else {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    }

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onPageHide);
    };
  }, []);

  // Ensure route transitions reset scroll to top unless an intentional hash is targeted
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToTop = () => {
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    };

    const hash = window.location.hash;
    if (!hash) {
      scrollToTop();
      return;
    }

    // Cross-page hash links (e.g. /about → /#our-work): wait for the new page to lay out, then
    // re-measure Lenis so it doesn't clamp to the previous (shorter) page's height.
    let frame = 0;
    let attempts = 0;
    const scrollToHash = () => {
      const target = document.querySelector(hash);
      if (!target) {
        if (attempts++ < 30) frame = requestAnimationFrame(scrollToHash);
        else scrollToTop();
        return;
      }
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    };
    frame = requestAnimationFrame(scrollToHash);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <>{children}</>;
}
