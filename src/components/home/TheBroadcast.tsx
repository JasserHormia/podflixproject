"use client";

import { motion, useReducedMotion } from "framer-motion";

const PHRASE =
  "EVERY STORY STARTS HERE · STUDIO · PRODUCTION · EDITING · DUBAI · PODFLIX · ";

export default function TheBroadcast() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-background">
      {/* Static punchline — above the ticker */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 max-w-3xl px-6 text-center font-display text-xl font-black uppercase tracking-[0.15em] text-cream md:text-2xl"
      >
        Trusted by creators who take their work seriously.
      </motion.h2>

      {/* Infinite ticker — two copies translate -50% for a seamless seam */}
      <div aria-hidden className="pointer-events-none flex w-full items-center overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap font-display text-4xl font-black text-cream/10 md:text-6xl"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          <span>{PHRASE.repeat(4)}</span>
          <span>{PHRASE.repeat(4)}</span>
        </motion.div>
      </div>
    </section>
  );
}
