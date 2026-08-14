"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

const STEPS = [
  { n: "01", name: "Choose Your Session", desc: "Pick the package that fits your vision" },
  { n: "02", name: "Pick Your Date & Time", desc: "Real-time availability, instant confirmation" },
  { n: "03", name: "Show Up & Create", desc: "We handle everything else" },
];

export default function BookingHowTo() {
  const reduce = useReducedMotion();

  const list: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const row: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
  };

  return (
    <section className="flex min-h-[50vh] flex-col justify-center bg-background py-20">
      <motion.div
        variants={list}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {STEPS.map((step) => (
          <motion.div key={step.n} variants={row}>
            <div className="group flex items-center gap-6 border-b border-cream/10 px-8 py-8 transition-colors duration-300 hover:bg-surface md:px-16">
              <span className="w-20 shrink-0 font-display text-5xl font-black text-gold/30 md:w-32 md:text-6xl">
                {step.n}
              </span>
              <span className="flex-1 font-display text-xl font-semibold text-cream md:text-2xl">
                {step.name}
              </span>
              <span className="hidden flex-1 font-body text-base text-cream/40 md:block">
                {step.desc}
              </span>
              <span
                aria-hidden
                className="text-gold transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full-width animated gold line */}
      <motion.span
        aria-hidden
        className="mt-0 block h-px w-full origin-left bg-gold"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.9 }}
        transition={{ duration: 1.2, ease: EASE_EXPO }}
      />
    </section>
  );
}
