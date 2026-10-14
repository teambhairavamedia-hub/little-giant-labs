import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-theme bg-theme-card p-6 transition-colors hover:border-[color-mix(in_srgb,var(--theme-fg)_20%,var(--theme-border))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
