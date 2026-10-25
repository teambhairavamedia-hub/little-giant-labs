"use client";

import { motion } from "framer-motion";
import { CheckIcon, DiamondIcon, FilmIcon, LoopIcon, TrendIcon } from "@/components/ui/Icons";
import { useI18n } from "@/lib/i18n/context";

const serviceIcons = [DiamondIcon, FilmIcon, TrendIcon, LoopIcon];

export function ServiceGrid() {
  const { dict } = useI18n();
  const services = dict.about.capabilities.services;
  const deliverablesBadge = dict.about.capabilities.deliverablesBadge;
  const startProjectLabel = dict.about.capabilities.startProject;

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
      className="grid gap-6 md:grid-cols-2"
    >
      {services.map((service, index) => {
        const IconComponent = serviceIcons[index % serviceIcons.length];
        return (
          <motion.div
            key={service.title}
            variants={cardVariants}
            className="group rounded-3xl border border-theme bg-theme-card p-8 md:p-10 transition-all duration-300 hover:border-theme-hover shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] flex flex-col justify-between"
            style={{ willChange: "transform, opacity" }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-theme bg-[color-mix(in_srgb,var(--lgl-gold)_10%,transparent)] text-lgl-gold transition-colors duration-300 group-hover:border-[color-mix(in_srgb,var(--lgl-gold)_55%,transparent)] md:h-14 md:w-14">
                  <IconComponent size={24} />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-theme-subtle border border-theme rounded-full px-3 py-1 opacity-70">
                  {deliverablesBadge}
                </span>
              </div>

              <h2
                className="mt-6 text-xl md:text-2xl font-bold tracking-tight text-[var(--theme-fg)]"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {service.title}
              </h2>

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-theme-muted font-light">
                {service.description}
              </p>

              <ul className="mt-8 space-y-3">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs md:text-sm text-theme-muted/80">
                    <CheckIcon size={14} strokeWidth={2} className="shrink-0 text-lgl-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-theme flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-theme-subtle font-medium">
                {startProjectLabel}
              </span>
              <span className="w-8 h-8 rounded-full border border-theme flex items-center justify-center text-theme-subtle transition-all duration-300 group-hover:border-theme-hover group-hover:translate-x-1">
                →
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
