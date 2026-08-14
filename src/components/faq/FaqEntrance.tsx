"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import CircularText from "@/components/ui/CircularText";

export default function FaqEntrance() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.25 } },
  };
  const line: Variants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_EXPO } },
  };

  return (
    <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden bg-background px-8 pb-16 pt-32 md:px-16">
      <motion.p
        className="text-eyebrow mb-8 font-body text-gold"
        style={{ letterSpacing: "0.4em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 }}
      >
        PODFLIX / FAQ
      </motion.p>

      <motion.h1
        className="font-display font-black leading-[0.82] tracking-[-0.03em]"
        style={{ fontSize: "clamp(72px, 11vw, 150px)" }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={line} className="block text-cream">
          Got
        </motion.span>
        <motion.span variants={line} className="block text-gold">
          Questions?
        </motion.span>
      </motion.h1>

      <motion.p
        className="mt-8 max-w-md font-body text-lg text-cream/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: reduce ? 0 : 0.6 }}
      >
        We&apos;ve got answers. And if we don&apos;t — we&apos;ll pick up the phone.
      </motion.p>

      {/* Bottom-right rotating seal */}
      <motion.div
        className="absolute bottom-16 right-8 z-10 hidden md:block lg:right-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <CircularText text="STUDIO · DUBAI · FAQ · PODFLIX · " size={150} />
      </motion.div>
    </section>
  );
}
