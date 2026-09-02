"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { useIsTouch } from "@/lib/useIsTouch";

const WORDS = [
  { text: "Every", className: "text-cream" },
  { text: "Story", className: "text-cream" },
  { text: "Starts", className: "text-cream" },
  { text: "Here.", className: "text-gold" },
];

const TICKER = "STUDIO · DUBAI · PRODUCTION · EDITING · PODFLIX · ";

export default function AboutManifesto() {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };
  const word: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE_EXPO } },
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-background">
      <div className="w-full pl-8 md:pl-16">
        <motion.p
          className="text-eyebrow mb-8 font-body text-gold"
          style={{ letterSpacing: "0.4em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 }}
        >
          PODFLIX / ABOUT
        </motion.p>

        <div className="flex items-center gap-10">
          <motion.h1
            className="origin-left font-display font-black leading-[0.82] tracking-[-0.03em]"
            style={{ fontSize: "clamp(72px, 12vw, 160px)" }}
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {WORDS.map((w) => (
              <motion.span
                key={w.text}
                variants={word}
                className={`block origin-left ${w.className}`}
              >
                {w.text}
              </motion.span>
            ))}
          </motion.h1>

          {/* Vertical gold line + belief column (desktop only) */}
          <div className="hidden items-start gap-6 md:flex">
            <motion.span
              aria-hidden
              className="block w-px origin-top bg-gold"
              style={{ height: "16rem" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: reduce ? 0 : 1.2 }}
            />
            <motion.p
              className="max-w-[200px] font-body text-base text-cream/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: reduce ? 0 : 1.6 }}
            >
              We believe every voice deserves a world-class stage. Podflix is that
              stage.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Faint bottom ticker */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 flex w-full overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap font-display text-6xl font-black text-cream/5"
          animate={reduce || isTouch ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          <span>{TICKER.repeat(3)}</span>
          <span>{TICKER.repeat(3)}</span>
        </motion.div>
      </div>
    </section>
  );
}
