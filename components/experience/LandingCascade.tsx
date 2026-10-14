"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";
import {
  dispatchIntroComplete,
  markIntroPlayed,
} from "@/lib/intro";
import { cn } from "@/lib/utils";

const heroImages = [
  "https://images.unsplash.com/photo-1756312148347-611b60723c7a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzN3x8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1757865579201-693dd2080c73?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2MXx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1756786605218-28f7dd95a493?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMzh8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1757519740947-eef07a74c4ab?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNDh8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1757263005786-43d955f07fb1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNzB8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1757207445614-d1e12b8f753e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxODZ8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1757269746970-dc477517268f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMjN8fHxlbnwwfHx8fHw%3D",
];

const imagesConfig = [
  {
    id: 1,
    url: heroImages[0],
    stacked: { x: 0, y: 0, rotate: -2, zIndex: 10, scale: 1 },
    fanned: { x: -350, y: 150, rotate: -12, scale: 0.8, zIndex: 20 },
    alt: "Showcase 1",
  },
  {
    id: 2,
    url: heroImages[1],
    stacked: { x: 40, y: -20, rotate: 5, zIndex: 11, scale: 1 },
    fanned: { x: -280, y: -180, rotate: -4, scale: 0.75, zIndex: 21 },
    alt: "Showcase 2",
  },
  {
    id: 3,
    url: heroImages[2],
    stacked: { x: -30, y: 30, rotate: -8, zIndex: 12, scale: 1 },
    fanned: { x: 300, y: -160, rotate: 8, scale: 0.85, zIndex: 22 },
    alt: "Showcase 3",
  },
  {
    id: 4,
    url: heroImages[3],
    stacked: { x: 20, y: 40, rotate: 10, zIndex: 13, scale: 1 },
    fanned: { x: 0, y: 220, rotate: -2, scale: 0.7, zIndex: 23 },
    alt: "Showcase 4",
  },
  {
    id: 5,
    url: heroImages[4],
    stacked: { x: -50, y: -40, rotate: -6, zIndex: 14, scale: 1 },
    fanned: { x: 320, y: 140, rotate: 6, scale: 0.8, zIndex: 24 },
    alt: "Showcase 5",
  },
  {
    id: 6,
    url: heroImages[5],
    stacked: { x: 60, y: 10, rotate: 4, zIndex: 15, scale: 1 },
    fanned: { x: -380, y: -10, rotate: -15, scale: 0.75, zIndex: 25 },
    alt: "Showcase 6",
  },
  {
    id: 7,
    url: heroImages[6],
    stacked: { x: -10, y: -15, rotate: -3, zIndex: 16, scale: 1 },
    fanned: { x: 380, y: -10, rotate: 15, scale: 0.75, zIndex: 26 },
    alt: "Showcase 7",
  },
];

type LandingCascadeProps = {
  onComplete?: () => void;
  onRevealStart?: () => void;
};

function getMultiplier(width: number) {
  if (width < 640) return 0.38;
  if (width < 768) return 0.58;
  if (width < 1024) return 0.75;
  return 1;
}

export function LandingCascade({ onComplete, onRevealStart }: LandingCascadeProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isFannedOut, setIsFannedOut] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const timeoutsRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);
  const sequenceDoneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onRevealStartRef = useRef(onRevealStart);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onRevealStartRef.current = onRevealStart;
  }, [onComplete, onRevealStart]);

  const mult = getMultiplier(windowWidth);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWindowWidth(window.innerWidth);
    document.body.style.overflow = "hidden";

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      timeoutsRef.current.push(id);
    };

    intervalRef.current = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < imagesConfig.length) {
          return prev + 1;
        }

        if (sequenceDoneRef.current) {
          return prev;
        }

        sequenceDoneRef.current = true;

        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Fan out images
        schedule(() => setIsFannedOut(true), 500);

        // Start exit slide at 1800ms, mark intro played immediately so
        // template.tsx detects returning visit before hero renders
        schedule(() => {
          markIntroPlayed();
          dispatchIntroComplete();
          setIsExiting(true);
          onRevealStartRef.current?.(); // Reveal hero text immediately as slide starts
        }, 1800);

        // Exit animation is 850ms — fire onComplete at 2750ms to unmount splash screen fully
        schedule(() => {
          onCompleteRef.current?.();
        }, 2750);

        return prev;
      });
    }, 110);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <motion.section
      animate={isExiting ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      className={cn(
        "fixed inset-0 z-[9999] flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-center",
        isExiting ? "pointer-events-none" : "pointer-events-auto",
      )}
      style={{ background: "#ffffff" }}
      aria-label="Intro splash screen"
    >
      <div className="theme-noise pointer-events-none absolute inset-0" />

      <div className="relative z-10 max-w-3xl px-6 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 flex items-center justify-center gap-3"
        >
          <img
            src="/favicon.svg"
            alt="Bhairava Media Logo"
            className="w-10 h-10 object-contain shadow-md rounded-full"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="mb-3 text-[9px] sm:text-[10px] uppercase tracking-[0.28em] sm:tracking-[0.4em] text-[#0a0a0a]/40 font-medium"
        >
          Digital Growth Studio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold uppercase tracking-[0.14em] sm:tracking-[0.22em] text-[#0a0a0a]"
        >
          {siteConfig.name}
        </motion.h1>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-[300px] w-[300px] items-center justify-center overflow-visible sm:h-[400px] sm:w-[400px]">
          {imagesConfig.map((img, index) => {
            const isVisible = visibleCount > index;

            return (
              <motion.div
                key={img.id}
                className={cn(
                  "absolute aspect-[3/4] w-28 overflow-hidden rounded-2xl border border-[#e4e4e7] bg-[#f4f4f5] shadow-xl sm:w-44 md:w-52",
                  isFannedOut && "pointer-events-auto cursor-pointer",
                )}
                initial={{
                  opacity: 0,
                  scale: 0.55,
                  x: img.stacked.x * mult,
                  y: (img.stacked.y + 120) * mult,
                  rotate: img.stacked.rotate,
                }}
                animate={
                  isVisible
                    ? {
                        opacity: 1,
                        scale: isFannedOut ? img.fanned.scale : img.stacked.scale,
                        x: (isFannedOut ? img.fanned.x : img.stacked.x) * mult,
                        y: (isFannedOut ? img.fanned.y : img.stacked.y) * mult,
                        rotate: isFannedOut ? img.fanned.rotate : img.stacked.rotate,
                        zIndex: isFannedOut ? img.fanned.zIndex : img.stacked.zIndex,
                      }
                    : {}
                }
                whileHover={
                  isFannedOut
                    ? {
                        scale: img.fanned.scale * 1.12,
                        rotate: img.fanned.rotate * 0.5,
                        zIndex: 100,
                        transition: { type: "spring", stiffness: 320, damping: 22 },
                      }
                    : undefined
                }
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: isFannedOut ? 18 : 14,
                  mass: 0.7,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  className="pointer-events-none h-full w-full select-none object-cover"
                  loading="eager"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
