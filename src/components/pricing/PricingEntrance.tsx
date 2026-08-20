"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";
import CircularText from "@/components/ui/CircularText";

const HEADING = ["Invest", "in", "your", "voice."];
const OVERLAY =
  "linear-gradient(135deg, rgba(10,8,7,0.95) 0%, rgba(10,8,7,0.6) 50%, rgba(10,8,7,0.95) 100%)";

export default function PricingEntrance() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_EXPO } },
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <Image
        src={IMAGES.solo_5}
        alt="A host recording at Podflix"
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0" style={{ background: OVERLAY }} />

      {/* Top-left label (offset below the fixed navbar) */}
      <motion.p
        className="text-eyebrow absolute left-8 top-24 z-10 font-body text-gold md:left-16"
        style={{ letterSpacing: "0.4em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 }}
      >
        PODFLIX / PRICING
      </motion.p>

      {/* Bottom-left content */}
      <div className="absolute bottom-16 left-8 z-10 md:left-16">
        <motion.h1
          className="max-w-4xl font-display font-black leading-[0.85] tracking-[-0.03em] text-cream"
          style={{ fontSize: "clamp(60px, 10vw, 130px)" }}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {HEADING.map((w) => (
            <motion.span key={w} variants={word} className="mr-[0.25em] inline-block">
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.span
          aria-hidden
          className="mt-6 block h-px w-16 origin-left bg-gold"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: reduce ? 0 : 1 }}
        />

        <motion.p
          className="mt-6 max-w-md font-body text-lg text-cream/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: reduce ? 0 : 1.3 }}
        >
          Three ways to tell your story.
        </motion.p>
      </div>

      {/* Bottom-right rotating seal */}
      <motion.div
        className="absolute bottom-16 right-8 z-10 hidden md:block lg:right-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <CircularText
          text="STUDIO · PRODUCTION · EDITING · DUBAI · PODFLIX · "
          size={160}
        />
      </motion.div>
    </section>
  );
}
