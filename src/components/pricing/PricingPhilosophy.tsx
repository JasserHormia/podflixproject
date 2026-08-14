"use client";

import { motion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import TextWipe from "@/components/ui/TextWipe";

export default function PricingPhilosophy() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-6 py-24 text-center">
      <TextWipe
        as="h2"
        text={["Professional content", "shouldn't cost", "a fortune."]}
        className="font-display text-[clamp(36px,5vw,72px)] font-black leading-[0.9] tracking-[-0.02em] text-cream"
      />

      <motion.p
        className="mt-10 text-sm uppercase tracking-[0.3em] text-gold"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.8 }}
      >
        Studio rental. Full production. Content packages. Pick your path.
      </motion.p>
    </section>
  );
}
