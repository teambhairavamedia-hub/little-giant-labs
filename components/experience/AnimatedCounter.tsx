"use client";

import { useEffect, useRef } from "react";

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  ready = true,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  ready?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!ready) return;

    const node = ref.current;
    if (!node) return;

    const run = () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const start = performance.now();
      const duration = 2000;

      const tick = (now: number) => {
        const elapsed = Math.min((now - start) / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - elapsed, 3);
        const current = eased * value;
        node.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
        if (elapsed < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    // Show static value immediately so it's never blank
    node.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [value, prefix, suffix, decimals, ready]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}
