"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/config/theme";
import { useInitialAnimation } from "@/hooks/use-initial-animation";

/**
 * Re-mounts on every navigation, which makes it the place for a page
 * transition. The very first page load skips it: `initial` is inlined into
 * the server HTML, and an opacity-0 first paint would delay the LCP.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldSkip = useInitialAnimation();

  return (
    <motion.div
      initial={shouldSkip ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
