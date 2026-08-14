"use client";

import { motion, useReducedMotion } from "framer-motion";

const PHRASE =
  "EVERY STORY STARTS HERE · STUDIO · PRODUCTION · EDITING · DUBAI · PODFLIX · ";

export default function TheBroadcast() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-background">
      {/* Infinite ticker — two copies translate -50% for a seamless seam */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center">
        <motion.div
          className="flex whitespace-nowrap font-display text-4xl font-black text-cream/10 md:text-6xl"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          <span className="pr-0">{PHRASE.repeat(4)}</span>
          <span className="pr-0">{PHRASE.repeat(4)}</span>
        </motion.div>
      </div>

      {/* Static punchline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md px-6 text-center font-body text-xl text-cream"
      >
        Trusted by creators who take their work seriously.
      </motion.p>
    </section>
  );
}
