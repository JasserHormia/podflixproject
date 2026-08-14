"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

const STATS = ["1 Studio", "∞ Stories", "0 Excuses"];

export default function TheNumber() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Count 0 → 100 as the panel travels to center; parallax lift for depth.
  const count = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const numberY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  // Update the giant number's text directly — no per-frame re-render.
  useMotionValueEvent(count, "change", (v) => {
    if (reduce || !numberRef.current) return;
    numberRef.current.textContent = Math.round(v).toString();
  });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
    >
      {/* The counting number IS the texture — massive, faint, parallaxed */}
      <motion.span
        aria-hidden
        style={reduce ? undefined : { y: numberY }}
        className="pointer-events-none absolute select-none font-display text-[40vw] font-black leading-none text-cream/10"
      >
        <span ref={numberRef}>{reduce ? "100" : "0"}</span>
      </motion.span>

      {/* Foreground statement */}
      <div className="relative z-10 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
          className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-cream md:text-6xl"
        >
          100% of what you need to go from idea to published episode.
        </motion.h2>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {STATS.map((stat, i) => (
            <motion.span
              key={stat}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.2 + i * 0.1 }}
              className="text-sm uppercase tracking-[0.3em] text-gold"
            >
              {stat}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
