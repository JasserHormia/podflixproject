"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

const TICKER =
  "3-Camera Setup · Professional Audio · Studio Operator · 12 Themed Sets · 4K Export · Color Grading · Animated Captions · Motion Graphics · ";

const STATS = [
  { value: "12", label: "Themed studio sets" },
  { value: "4K", label: "Cinema quality output" },
  { value: "AED 590", label: "Starting price per session" },
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
    <section className="bg-background py-24">
      {/* Static heading — above the ticker */}
      <div className="mb-12 px-6 text-center">
        <h2 className="font-display text-3xl font-black leading-tight text-cream md:text-5xl">
          Everything included. No hidden fees.
        </h2>
      </div>

      {/* Ticker */}
      <div className="mb-16 overflow-hidden">
        <motion.div
          aria-hidden
          className="flex whitespace-nowrap font-display text-4xl font-black text-cream/20 md:text-5xl"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 35, ease: "linear", repeat: Infinity }}
        >
          <span>{TICKER.repeat(2)}</span>
          <span>{TICKER.repeat(2)}</span>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        className="flex flex-wrap justify-center gap-16 px-8 text-center md:gap-32"
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
