"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/hooks/useGsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure browser does not restore stale scroll positions on refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    registerGsap();
    ScrollTrigger.clearScrollMemory();

    const onPageHide = () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      ScrollTrigger.clearScrollMemory();
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

    // Prevent GSAP from compensating lag spikes (e.g. tab switching)
    gsap.ticker.lagSmoothing(0);

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
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis virtual scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP's RAF — prevents double-RAF and ensures single animation loop
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);

    // Refresh ScrollTrigger on resize
    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleRefresh);

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
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("resize", handleRefresh);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onPageHide);
      ScrollTrigger.clearScrollMemory();
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
      ScrollTrigger.refresh();
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
