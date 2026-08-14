"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

const TICKER =
  "3-Camera Setup · Professional Audio · Studio Operator · 10 Premium Sets · 4K Export · Color Grading · Animated Captions · Motion Graphics · ";

const STATS = [
  { value: "10+", label: "Premium studio sets" },
  { value: "4K", label: "Cinema quality output" },
  { value: "AED 650", label: "Starting price per hour" },
];

export default function AlwaysIncluded() {
  const reduce = useReducedMotion();

  const statContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const statItem: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EXPO } },
  };

  return (
    <section className="overflow-hidden bg-background py-24">
      {/* Ticker + centered statement */}
      <div className="relative flex items-center overflow-hidden py-4">
        <motion.div
          aria-hidden
          className="flex whitespace-nowrap font-display text-4xl font-black text-cream/20 md:text-5xl"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 35, ease: "linear", repeat: Infinity }}
        >
          <span>{TICKER.repeat(2)}</span>
          <span>{TICKER.repeat(2)}</span>
        </motion.div>

        <p className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center font-display text-3xl font-black leading-tight text-cream md:text-5xl">
          <span>Everything included.</span>
          <span>No hidden fees.</span>
        </p>
      </div>

      {/* Stats */}
      <motion.div
        className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-10 px-6 text-center sm:grid-cols-3"
        variants={statContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {STATS.map((stat) => (
          <motion.div key={stat.label} variants={statItem}>
            <p className="font-display text-5xl font-black text-gold">{stat.value}</p>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-cream/40">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
