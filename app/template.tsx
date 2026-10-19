"use client";

import { MotionConfig, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {/* Framer Motion animations follow the visitor's reduced-motion setting */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </motion.div>
  );
}
