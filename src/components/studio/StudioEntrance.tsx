"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { PHOTOS } from "@/lib/images";
import { useIsTouch } from "@/lib/useIsTouch";

const HEADING = ["The", "Studio."];
const OVERLAY =
  "linear-gradient(to bottom, rgba(10,8,7,0.3) 0%, rgba(10,8,7,0.7) 60%, rgba(10,8,7,1) 100%)";

export default function StudioEntrance() {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();

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
      {/* Full-bleed background */}
      <Image
        src={PHOTOS.studio_navy_duo}
        alt="Navy-panelled podcast set with two ornate armchairs, brass floor lamps and boom microphones — Podflix Studio, Business Bay Dubai"
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0" style={{ background: OVERLAY }} />

      {/* Top-left label — offset below the fixed navbar to avoid the logo */}
      <motion.p
        className="text-eyebrow absolute left-8 top-24 z-10 font-body text-gold md:left-16"
        style={{ letterSpacing: "0.4em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 }}
      >
        PODFLIX / STUDIO
      </motion.p>

      {/* Bottom-left content block */}
      <div className="absolute bottom-16 left-8 z-10 md:left-16">
        <motion.h1
          className="font-display font-black leading-none tracking-[-0.03em] text-cream"
          style={{ fontSize: "clamp(60px, 10vw, 140px)" }}
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
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: reduce ? 0 : 0.9 }}
        />

        <motion.p
          className="mt-6 max-w-md font-body text-lg text-cream/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: reduce ? 0 : 1.2 }}
        >
          Dubai&apos;s premier podcast production studio.
        </motion.p>
      </div>

      {/* Scroll indicator bottom-right */}
      <motion.div
        className="absolute bottom-16 right-8 z-10 flex flex-col items-center gap-3 md:right-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <span
          className="text-[10px] tracking-[0.4em] text-text-muted"
          style={{ writingMode: "vertical-rl" }}
        >
          SCROLL ↓
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-border">
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2 bg-gold"
            animate={reduce || isTouch ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
      </motion.div>
    </section>
  );
}
