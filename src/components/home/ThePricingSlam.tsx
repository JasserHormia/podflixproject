"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import {
  FROM_EDITING_PRICE,
  FROM_PRICE,
  SESSIONS,
  formatPrice,
} from "@/lib/booking";
import { PROMO_ACTIVE, promoPrice } from "@/lib/promo";

/**
 * Read from SESSIONS rather than typed out. These three numbers used to be
 * hardcoded strings and would have gone stale the moment the promotion landed,
 * advertising the old price beside the discounted one on the same screen.
 *
 * The descriptor carries the "AED", so the figures render bare — hence
 * toLocaleString here instead of the shared PriceTag, which formats a full
 * "AED 1,180".
 */
const TIERS = (
  [
    ["studio-1h", "Studio Only", "AED · per hour"],
    ["edit-1h", "Studio + Editing", "AED · per hour"],
    ["signature", "Signature Episode", "AED · 2 hours, dynamic edit"],
  ] as const
).map(([id, name, descriptor]) => {
  const original = SESSIONS.find((s) => s.id === id)!.price;
  return {
    name,
    descriptor,
    original: original.toLocaleString("en-US"),
    now: promoPrice(original).toLocaleString("en-US"),
  };
});

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
              <span className="text-center">
                {PROMO_ACTIVE && (
                  <span
                    aria-hidden
                    className="block font-display text-2xl font-black leading-none text-cream/30 line-through decoration-1 md:text-3xl"
                  >
                    {tier.original}
                  </span>
                )}
                <span className="block font-display text-[12vw] font-black leading-none text-cream transition-colors duration-300 group-hover:text-gold md:text-[8vw]">
                  {tier.now}
                </span>
              </span>
              <span className="font-body text-lg text-gold md:text-right">
                {tier.descriptor}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Derived too — a hardcoded "from AED 590/hour" directly under a
          discounted 413 would contradict the numbers above it. FROM_PRICE and
          FROM_EDITING_PRICE are already promo-aware. */}
      <p className="mt-14 text-center text-sm text-text-muted">
        Studio from {formatPrice(FROM_PRICE)}/hour · With editing from{" "}
        {formatPrice(FROM_EDITING_PRICE)}/hour.
      </p>
    </section>
  );
}
