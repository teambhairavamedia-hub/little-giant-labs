import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

/* Noomo-style: pill shape, ultra-tracked uppercase label, razor-thin border */
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--theme-btn-primary-bg)] text-[var(--theme-btn-primary-fg)] border border-[var(--theme-btn-primary-bg)] hover:opacity-80",
  secondary:
    "bg-transparent text-[var(--theme-fg)] hover:bg-[var(--theme-btn-ghost-bg)] border border-theme",
  ghost:
    "bg-transparent text-[var(--theme-fg)] hover:opacity-70 border border-transparent",
};

type BaseProps = {
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = BaseProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = cn(
    /* Noomo pill: rounded-full, DM Sans, tiny tracking, no uppercase on primary — keeps it clean */
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3",
    "label-nav transition-all duration-300",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return <Link href={href} className={classes} {...linkProps} />;
  }

  return <button className={classes} {...(props as ButtonAsButton)} />;
}
