"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
};

export function MagneticButton({
  href,
  children,
  className,
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node) return;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      // Remove transition during active tracking for instant follow
      node.style.transition = "transform 0ms";
      node.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    // Smooth spring-like return to origin
    node.style.transition = "transform 500ms cubic-bezier(0.23, 1, 0.32, 1)";
    node.style.transform = "translate(0px, 0px)";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "magnetic-btn inline-flex items-center justify-center rounded-full px-8 py-4 label-nav transition-all duration-300",
        variant === "primary"
          ? "bg-[var(--theme-btn-primary-bg)] text-[var(--theme-btn-primary-fg)] hover:opacity-80"
          : "border border-[var(--theme-btn-ghost-border)] text-[var(--theme-fg)] hover:bg-[var(--theme-btn-ghost-bg)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
