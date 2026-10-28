"use client";

import { motion } from "framer-motion";
import { CheckIcon, DiamondIcon, FilmIcon, LoopIcon, TrendIcon } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";

const serviceIcons = [DiamondIcon, FilmIcon, TrendIcon, LoopIcon];

export function ServiceGrid() {
  const { dict } = useI18n();
  const services = dict.about.capabilities.services;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="about-service-grid grid gap-6 md:grid-cols-2"
    >
      {services.map((service, index) => {
        const IconComponent = serviceIcons[index % serviceIcons.length];
        return (
          <motion.div
            key={service.title}
            variants={cardVariants}
            className="group flex h-full flex-col rounded-3xl border border-theme bg-theme-card p-6 md:p-8 transition-all duration-300 hover:border-theme-hover shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)]"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="grid content-start">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-theme bg-[color-mix(in_srgb,var(--lgl-gold)_10%,transparent)] text-lgl-gold transition-colors duration-300 group-hover:border-[color-mix(in_srgb,var(--lgl-gold)_55%,transparent)] md:h-14 md:w-14">
                  <IconComponent size={24} />
                </span>
                <span className="text-sm font-semibold tracking-[0.08em] text-theme-subtle">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3
                className="mt-6 text-xl md:text-2xl font-bold tracking-tight text-[var(--theme-fg)]"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {service.title}
              </h3>

              {service.tagline && (
                <p className="mt-2 text-base font-medium italic leading-relaxed text-lgl-gold">
                  {service.tagline}
                </p>
              )}

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-theme-muted">
                {service.description}
              </p>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.1em] text-theme-subtle">
                Our capabilities include
              </p>
              <ul className="mt-3 space-y-2.5">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-theme-muted/90">
                    <CheckIcon size={14} strokeWidth={2} className="shrink-0 text-lgl-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {service.outcome && (
              <p className="mt-auto border-t border-theme pt-5 text-sm leading-relaxed text-theme-muted">
                <span className="font-semibold text-[var(--theme-fg)]">The outcome: </span>
                {service.outcome}
              </p>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
