"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

const TIERS = [
  { name: "Studio Rental", price: "650", descriptor: "AED per hour" },
  { name: "Podcast Production", price: "1,500", descriptor: "AED · record + edit" },
  { name: "Podcast + Reels", price: "1,700", descriptor: "AED · from" },
];

export default function ThePricingSlam() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const row: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_EXPO } },
  };

  return (
    <section className="bg-background py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {TIERS.map((tier) => (
          <motion.div key={tier.name} variants={row}>
            <Link
              href="/booking"
              className="group grid grid-cols-1 items-center gap-2 border-b border-border px-6 py-16 transition-colors duration-300 hover:bg-surface sm:px-10 md:grid-cols-3 lg:px-16"
            >
              <span className="text-sm uppercase tracking-[0.3em] text-cream/40">
                {tier.name}
              </span>
              <span className="text-center font-display text-[12vw] font-black leading-none text-cream transition-colors duration-300 group-hover:text-gold md:text-[8vw]">
                {tier.price}
              </span>
              <span className="font-body text-lg text-gold md:text-right">
                {tier.descriptor}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-14 text-center text-sm text-text-muted">
        Bundle packages from AED 1,700 — reels, editing, and more included.
      </p>
    </section>
  );
}
