"use client";

import { useEffect, useState } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/hooks/useGsap";
import { hasIntroPlayed } from "@/lib/intro";
import { LandingCascade } from "@/components/experience/LandingCascade";
import {
  CinematicHero,
  AboutSnap,
  MarqueeText,
  StorySticky,
  HorizontalPortfolio,
  ReelStack,
  TestimonialsAsymmetric,
} from "@/components/experience/HomeSections";

export function HomeExperience() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const played = hasIntroPlayed();
    requestAnimationFrame(() => {
      setIntroComplete(played);
      setShowSplash(!played);
    });
  }, []);

  useEffect(() => {
    if (!introComplete) return;

    registerGsap();

    const marqueeTween = gsap.to(".marquee-track", {
      xPercent: -50,
      ease: "none",
      duration: 42,
      repeat: -1,
    });

    const refresh = () => ScrollTrigger.refresh();
    const refreshTimeout = window.setTimeout(refresh, 250);

    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.clearTimeout(refreshTimeout);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      marqueeTween.kill();
    };
  }, [introComplete]);

  return (
    <>
      {showSplash ? (
        <LandingCascade
          onRevealStart={() => {
            setIntroComplete(true);
          }}
          onComplete={() => {
            setShowSplash(false);
            document.body.style.overflow = "";
            window.setTimeout(() => ScrollTrigger.refresh(), 300);
          }}
        />
      ) : null}

      {/* Hero page content — always in DOM. Individual animated elements
          start hidden via inline opacity:0 and are revealed by GSAP. */}
      <div className="experience-page">

        {/* ① Hero — white */}
        <CinematicHero ready={introComplete} />

        {/* ② Thin brand ticker */}
        <MarqueeText />

        {/* ③ About Us — light */}
        <AboutSnap />

        {/* ④ Story / Services — light */}
        <StorySticky ready={introComplete} />

        {/* ⑤ Portfolio — light */}
        <HorizontalPortfolio ready={introComplete} />

        {/* ⑥ Reels — BLACK (the one dark section) */}
        <ReelStack ready={introComplete} />

        {/* ⑦ Testimonials — light */}
        {/* <TestimonialsAsymmetric /> */}

      </div>
    </>
  );
}
