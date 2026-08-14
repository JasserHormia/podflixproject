"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_EXPO } from "@/lib/motion";

const DURATION = 0.7;
const EASE = EASE_EXPO;

/**
 * Pre-built motion components, created once at module scope.
 * Selecting from this map (rather than calling motion.create during render)
 * keeps component identity stable and satisfies react-hooks/static-components.
 */
const MOTION_TAGS = {
  section: motion.section,
  div: motion.div,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  ul: motion.ul,
  li: motion.li,
  span: motion.span,
} as const;

/** Tags that AnimatedSection / AnimatedItem can render as. */
type MotionTagName = keyof typeof MOTION_TAGS;

/** Default fade + slide-up variants for a single block. */
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
};

/** Container that staggers its animated children. */
const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** Child item used inside a staggered container. */
const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
};

type AnimatedSectionProps = {
  children: ReactNode;
  /** Render as a stagger container for lists of children. */
  stagger?: boolean;
  /** Underlying element/tag to render. Defaults to a section. */
  as?: MotionTagName;
  className?: string;
  /** Re-trigger every time it enters the viewport. Defaults to once. */
  once?: boolean;
  /** viewport amount threshold (0–1). */
  amount?: number;
};

/**
 * Scroll-reveal wrapper built on Framer Motion.
 * - Default: fade + slide up on `whileInView`.
 * - `stagger`: reveals children in sequence — pair with <AnimatedItem>.
 * - Respects prefers-reduced-motion (renders statically, no animation).
 */
export default function AnimatedSection({
  children,
  stagger = false,
  as = "section",
  className,
  once = true,
  amount = 0.2,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={stagger ? staggerContainerVariants : fadeUpVariants}
    >
      {children}
    </MotionTag>
  );
}

type AnimatedItemProps = {
  children: ReactNode;
  as?: MotionTagName;
  className?: string;
};

/**
 * A single staggered child. Only animates when nested inside an
 * <AnimatedSection stagger>. Respects prefers-reduced-motion.
 */
export function AnimatedItem({
  children,
  as = "div",
  className,
}: AnimatedItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag className={className} variants={staggerItemVariants}>
      {children}
    </MotionTag>
  );
}
