"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { useIsTouch } from "@/lib/useIsTouch";

const LINES = ["Built for", "creators", "who are", "serious."];
const STATS = [
  { value: "4", label: "Guests max per session" },
  { value: "1080p+", label: "Video production quality" },
  { value: "∞", label: "Stories waiting to be told" },
];

/** One headline line, scroll-scrubbed from x:-80→0 with a per-line offset. */
function StatementLine({
  progress,
  index,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  children: string;
}) {
  const start = 0.05 + index * 0.08;
  const end = start + 0.28;
  const x = useTransform(progress, [start, end], [-80, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  return (
    <motion.span style={{ x, opacity }} className="block">
      {children}
    </motion.span>
  );
}

/**
 * Scroll-scrubbed headline. Owns the only useScroll in this file, so touch and
 * reduced motion render <StaticHeadline /> and attach no scroll listener.
 */
function ScrubbedHeadline({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "center center"],
  });
  return (
    <>
      {LINES.map((line, i) => (
        <StatementLine key={line} progress={scrollYProgress} index={i}>
          {line}
        </StatementLine>
      ))}
    </>
  );
}

/** The settled headline — every line at its final position. */
function StaticHeadline() {
  return (
    <>
      {LINES.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

export default function StudioStatement() {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();
  const ref = useRef<HTMLElement>(null);
  const scrub = !reduce && !isTouch;

  const statContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const statItem: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
  };

  return (
    <section
      ref={ref}
      className="flex min-h-[70vh] flex-col gap-16 bg-background px-8 py-24 md:flex-row md:items-center md:px-16"
    >
      {/* Left — the statement */}
      <h2
        className="font-display font-black leading-[0.85] tracking-[-0.02em] text-cream md:w-3/5"
        style={{ fontSize: "clamp(48px, 7vw, 100px)" }}
      >
        {scrub ? <ScrubbedHeadline target={ref} /> : <StaticHeadline />}
      </h2>

      {/* Right — stats */}
      <motion.div
        className="flex flex-col gap-10 md:w-2/5"
        variants={statContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {STATS.map((stat) => (
          <motion.div key={stat.label} variants={statItem}>
            <p className="font-display text-6xl font-black text-gold">{stat.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-cream/40">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
