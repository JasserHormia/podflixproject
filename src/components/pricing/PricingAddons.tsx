"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { ADDONS } from "@/lib/booking";
import PriceTag from "@/components/ui/PriceTag";

/** Compact add-on cards — extras that stack onto any session. */
export default function PricingAddons() {
  const reduce = useReducedMotion();

  const list: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
  };

  return (
    <section className="bg-background px-8 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Add-ons</p>
        <h2
          className="mt-4 font-display font-black leading-[0.9] text-cream"
          style={{ fontSize: "clamp(32px, 4.5vw, 64px)" }}
        >
          Already have footage?
        </h2>
        <p className="mt-4 max-w-md font-body text-lg text-cream/50">
          Add either of these to a session — or book them on their own.
        </p>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"
          variants={list}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {ADDONS.map((a) => (
            <motion.div
              key={a.id}
              variants={card}
              className="border border-cream/10 bg-surface p-8 transition-colors duration-300 hover:border-gold/40"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold text-cream">
                  {a.name}
                </h3>
                <span className="shrink-0">
                  <PriceTag
                    original={a.price}
                    stacked
                    className="font-display text-2xl font-black text-gold"
                    strikeClassName="font-display text-sm font-semibold text-cream/30"
                  />
                </span>
              </div>

              <p className="mt-3 font-body text-sm text-cream/50">{a.description}</p>

              <ul className="mt-6 space-y-1">
                {a.includes.map((inc) => (
                  <li
                    key={inc}
                    className="flex items-start gap-2 font-body text-sm text-cream/60"
                  >
                    <span aria-hidden className="text-gold">
                      ✓
                    </span>
                    {inc}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-gold/70">
                {a.revisions}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
