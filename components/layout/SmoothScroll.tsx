"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/hooks/useGsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    registerGsap();

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
    });

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

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.removeEventListener("resize", handleRefresh);
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return <>{children}</>;
}
