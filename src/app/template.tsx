"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

/**
 * Page-enter transition. `template.tsx` re-mounts on every navigation, so this
 * gives each route a smooth, consistent entrance without jarring flashes.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  // Opacity-only (no transform): a lingering transform on this wrapper would
  // create a containing block that traps the homepage's `position: fixed`
  // animated wordmark. Fade is enough for a smooth route transition.
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}
