"use client";

import { useEffect, useState } from "react";
import { LandingCascade } from "@/components/experience/LandingCascade";
import { HomeRedesign } from "@/components/experience/HomeRedesign";
import { hasIntroPlayed } from "@/lib/intro";

export function HomeExperience() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!hasIntroPlayed()) setShowIntro(true);
  }, []);

  return (
    <>
      {showIntro && <LandingCascade onComplete={() => setShowIntro(false)} />}
      <HomeRedesign />
    </>
  );
}
