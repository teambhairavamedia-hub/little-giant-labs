"use client";

import { type CSSProperties, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import type { SectionTheme } from "@/lib/theme";
import { motion } from "framer-motion";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  theme?: SectionTheme;
  children?: ReactNode;
  /** Decorative illustration shown beside the heading on large screens. */
  visual?: ReactNode;
  style?: CSSProperties;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  theme = "dark",
  children,
  visual,
  style,
}: PageHeaderProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <Section theme={theme} className="border-b border-theme pt-28 md:pt-32" style={style}>
      <Container className="relative py-16 md:py-20">
        {visual ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute right-0 top-1/2 hidden h-[clamp(220px,26vw,340px)] w-[clamp(220px,26vw,340px)] -translate-y-1/2 lg:block"
            aria-hidden="true"
          >
            {visual}
          </motion.div>
        ) : null}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          {eyebrow ? (
            <motion.p variants={itemVariants} className="label-eyebrow mb-5 text-theme-subtle">
              {eyebrow}
            </motion.p>
          ) : null}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold tracking-[-0.04em] leading-[0.96] text-[var(--theme-fg)] max-w-3xl"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            {title}
          </motion.h1>
          {description ? (
            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-lg text-[0.9375rem] leading-[1.7] text-theme-muted font-light"
            >
              {description}
            </motion.p>
          ) : null}
          {children ? (
            <motion.div variants={itemVariants} className="mt-8">
              {children}
            </motion.div>
          ) : null}
        </motion.div>
      </Container>
    </Section>
  );
}
