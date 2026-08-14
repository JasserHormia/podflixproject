"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

const STATS = [
  { value: "1", label: "Studio. Perfectly equipped." },
  { value: "∞", label: "Stories waiting to be told." },
  { value: "0", label: "Compromises on quality." },
  { value: "24/7", label: "Passion for great content." },
];

export default function AboutNumbers() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_EXPO } },
  };

  return (
    <section className="bg-teal">
      <motion.span
        aria-hidden
        className="block h-px w-full origin-left bg-gold"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.9 }}
        transition={{ duration: 1.2, ease: EASE_EXPO }}
      />

      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={item}
            className={`px-8 py-16 ${
              i % 2 === 0 ? "border-r border-cream/10" : ""
            } ${i < 2 ? "border-b border-cream/10 md:border-b-0" : ""} ${
              i === 2 ? "md:border-r md:border-cream/10" : ""
            }`}
          >
            <p
              className="font-display font-black leading-none text-gold"
              style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
            >
              {stat.value}
            </p>
            <p className="mt-2 max-w-[140px] font-body text-sm tracking-wide text-cream/50">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
