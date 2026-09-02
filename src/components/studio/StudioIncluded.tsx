"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { useIsTouch } from "@/lib/useIsTouch";

const INCLUSIONS = [
  { name: "Acoustically Treated Room", detail: "Controlled recording environment" },
  { name: "Professional Lighting Rig", detail: "Cinema-grade Amaran setup" },
  { name: "4-Channel Mic Setup", detail: "Shure SM7B for every guest" },
  { name: "Recording Engineer", detail: "Available on request" },
  { name: "Studio Headphones", detail: "Beyerdynamic DT 770 Pro ×4" },
  { name: "Refreshments", detail: "Because great stories need fuel" },
  { name: "Post-Production", detail: "Add-on editing packages available" },
];

export default function StudioIncluded() {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();

  const rowVariants: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_EXPO } },
  };

  return (
    <section className="bg-background px-8 py-24 md:px-16">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16">
        {/* Left — sticky heading with a pulsing "live" dot */}
        <div className="md:sticky md:top-1/3">
          <motion.span
            aria-hidden
            className="mb-5 block h-2 w-2 rounded-full bg-gold"
            animate={reduce || isTouch ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          />
          <h2
            className="font-display font-black leading-tight text-cream"
            style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
          >
            Every session includes.
          </h2>
        </div>

        {/* Right — the tall list (drives the sticky scroll) */}
        <ul>
          {INCLUSIONS.map((item, i) => (
            <motion.li
              key={item.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={rowVariants}
              transition={{ delay: i * 0.02 }}
              className="group border-b border-cream/10 px-2 py-8 transition-colors duration-300 hover:bg-surface/30"
            >
              <span className="font-display text-2xl font-black text-gold/40 transition-colors duration-300 group-hover:text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-2xl font-semibold text-cream transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                {item.name}
              </h3>
              <p className="mt-1 font-body text-sm text-cream/40">{item.detail}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
