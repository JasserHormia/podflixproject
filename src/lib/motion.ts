import type { Variants } from "framer-motion";

/**
 * Shared motion tokens — the single source of truth for the site's feel.
 * Import these instead of hardcoding easings/durations per component.
 */

/** Signature easing — expo-out. Fast start, long luxurious settle. */
export const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Symmetric in-out for looping / drifting background motion. */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DUR = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
} as const;

/** Fade + rise, tuned with the signature easing. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_EXPO },
  },
};

/** Container that orchestrates staggered children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/** Word/line mask reveal — inner element rises out of an overflow-hidden clip. */
export const maskChild: Variants = {
  hidden: { y: "115%" },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: EASE_EXPO },
  },
};

/** Standard viewport trigger for scroll reveals. */
export const VIEWPORT = { once: true, amount: 0.35 } as const;
