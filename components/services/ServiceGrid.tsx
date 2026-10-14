"use client";

import { motion } from "framer-motion";

const servicesDetails = [
  {
    icon: "✦",
    title: "Brand Strategy & Design",
    description: "Positioning, messaging, and identity systems that command trust and build presence.",
    deliverables: [
      "Competitor funnel auditing",
      "Visual identity & logo design",
      "Brand voice & strategy books",
      "UX/UI design systems"
    ]
  },
  {
    icon: "◈",
    title: "Cinematic Content Production",
    description: "Premium brand videos, social showreels, and creative assets built for high retention.",
    deliverables: [
      "Short-form hook engineering",
      "Cinematic brand showreels",
      "Creative copy & scripting",
      "High-retention editing & sound design"
    ]
  },
  {
    icon: "⬡",
    title: "Performance & Digital Marketing",
    description: "Paid acquisition, social growth, and search visibility focused on measurable growth.",
    deliverables: [
      "Paid Ads (Meta, Google, YT)",
      "Growth funnel mapping & CRO",
      "ROAS-driven ad operations",
      "Real-time analytics dashboards"
    ]
  },
  {
    icon: "◎",
    title: "AI & Automation Solutions",
    description: "Custom workflow automations, AI analytics tools, and CRM systems engineered for scale.",
    deliverables: [
      "AI-powered customer workflows",
      "CRM & email automation loops",
      "Lead scoring analytics systems",
      "Custom business intelligence tools"
    ]
  }
];

export function ServiceGrid() {
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
      {servicesDetails.map((service) => (
        <motion.div
          key={service.title}
          variants={cardVariants}
          className="group rounded-3xl border border-theme bg-theme-card p-8 md:p-10 transition-all duration-300 hover:border-theme-hover shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] flex flex-col justify-between"
          style={{ willChange: "transform, opacity" }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xl md:text-2xl text-theme-subtle group-hover:text-[var(--theme-fg)] transition-colors duration-300">
                {service.icon}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-theme-subtle border border-theme rounded-full px-3 py-1 opacity-70">
                Deliverables
              </span>
            </div>
            
            <h2 className="mt-6 text-xl md:text-2xl font-bold tracking-tight text-[var(--theme-fg)]" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
              {service.title}
            </h2>
            
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-theme-muted font-light">
              {service.description}
            </p>

            <ul className="mt-8 space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs md:text-sm text-theme-muted/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--theme-fg)_40%,transparent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 pt-6 border-t border-theme flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-theme-subtle font-medium">
              Start Project
            </span>
            <span className="w-8 h-8 rounded-full border border-theme flex items-center justify-center text-theme-subtle transition-all duration-300 group-hover:border-theme-hover group-hover:translate-x-1">
              →
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
