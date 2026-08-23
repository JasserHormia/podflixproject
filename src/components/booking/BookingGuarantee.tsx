"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

const GUARANTEES = [
  {
    mark: "✓",
    title: "Instant Confirmation",
    desc: "Book online, get confirmed immediately.",
  },
  {
    mark: "24h",
    title: "Free Reschedule",
    desc: "Reschedule free up to 24 hours before your session.",
  },
  {
    mark: "∞",
    title: "Stories Created",
    desc: "Every session, every creator, every story — welcome here.",
  },
];

export default function BookingGuarantee() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
  };

  return (
    <section className="bg-teal py-24">
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {GUARANTEES.map((g, i) => (
          <motion.div
            key={g.title}
            variants={item}
            className={`px-8 py-10 transition-colors duration-300 hover:bg-surface/20 md:px-12 ${
              i < GUARANTEES.length - 1 ? "md:border-r md:border-cream/10" : ""
            }`}
          >
            <p className="font-display text-4xl font-black text-gold">{g.mark}</p>
            <h3 className="mt-4 font-display text-xl font-semibold text-cream">
              {g.title}
            </h3>
            <p className="mt-2 font-body text-sm text-cream/50">{g.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
