"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

/** Pre-built motion tags (stable identity — no components created during render). */
const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
  span: motion.span,
} as const;
type TagName = keyof typeof TAGS;

/**
 * Extra room below each segment so descenders (y, g, p, j) live inside the
 * element's border box instead of hanging outside it — headings here run at
 * leading 0.82–0.9, which pulls the box in tighter than the glyphs. The
 * negative margin cancels the padding so line spacing is unchanged.
 */
const DESCENDER_SAFE = "pb-[0.15em] -mb-[0.15em]";

/**
 * Clip-path text wipe. Each segment is revealed left→right by animating the
 * inset's right edge from 100% → 0%, staggered.
 *
 * Top and bottom insets stay negative for the whole animation, so the clip
 * region always extends past the box vertically and descenders are never cut —
 * a plain inset(0 0 0 0) end state clips them permanently at these leadings.
 *
 * - `text` string → single segment. Array → one segment each.
 * - `inline` renders segments inline (per-word wipes); otherwise stacked lines.
 * Respects reduced motion (renders statically).
 */
export default function TextWipe({
  text,
  as = "h2",
  inline = false,
  className = "",
  segmentClassName = "",
  stagger = 0.2,
  duration = 0.8,
  once = true,
}: {
  text: string | string[];
  as?: TagName;
  inline?: boolean;
  className?: string;
  segmentClassName?: string;
  stagger?: number;
  duration?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  const segments = Array.isArray(text) ? text : [text];

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className}>
        {inline
          ? segments.join(" ")
          : segments.map((s, i) => (
              <span key={i} className={`block ${DESCENDER_SAFE} ${segmentClassName}`}>
                {s}
              </span>
            ))}
      </Plain>
    );
  }

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };
  const seg: Variants = {
    hidden: { clipPath: "inset(-40% 100% -40% 0%)" },
    visible: {
      clipPath: "inset(-40% 0% -40% 0%)",
      transition: { duration, ease: EASE_EXPO },
    },
  };

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
    >
      {segments.map((s, i) => (
        <Fragment key={i}>
          <motion.span
            variants={seg}
            className={`${inline ? "inline-block" : "block"} ${DESCENDER_SAFE} ${segmentClassName}`}
          >
            {s}
          </motion.span>
          {inline && i < segments.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
