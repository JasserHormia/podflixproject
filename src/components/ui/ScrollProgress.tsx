"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useIsTouch } from "@/lib/useIsTouch";

const BAR_CLASS =
  "fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-linear-to-r from-gold-muted via-gold to-cream";

/** The bar itself. Separated so its scroll hooks are never mounted on touch. */
function Bar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return <motion.div aria-hidden style={{ scaleX }} className={BAR_CLASS} />;
}

/**
 * Thin gold progress bar pinned to the very top, tracking page scroll.
 *
 * Not rendered at all on touch. It is a decorative 2px line, and the cost is a
 * window scroll listener plus a spring that resolves on every frame the page
 * moves — on every route, since this lives in the root layout. Returning null
 * before <Bar /> mounts is what actually removes the listener; calling
 * useScroll and discarding the value would not.
 */
export default function ScrollProgress() {
  const isTouch = useIsTouch();
  if (isTouch) return null;
  return <Bar />;
}
