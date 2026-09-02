"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { PHOTOS } from "@/lib/images";

const HEADING = ["Reserve", "Your", "Studio."];
const OVERLAY =
  "linear-gradient(to bottom, rgba(10,8,7,0.7) 0%, rgba(10,8,7,0.5) 40%, rgba(10,8,7,1) 100%)";

/** Live Dubai wall-clock. Renders a deterministic placeholder during SSR to
 *  avoid hydration mismatch, then ticks every second on the client. */
function DubaiClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Dubai",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    // First tick on the next frame (deferred, not a synchronous effect setState).
    const raf = requestAnimationFrame(update);
    const id = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return (
    <motion.div
      className="absolute right-8 top-24 z-10 text-right md:right-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <p className="text-[9px] uppercase tracking-[0.4em] text-cream/30">DUBAI</p>
      <p className="mt-1 font-display text-2xl font-light tabular-nums text-cream">
        {time}
      </p>
      <p className="mt-1 text-[9px] tracking-[0.2em] text-cream/20">GST (UTC+4)</p>
    </motion.div>
  );
}

export default function BookingMoment() {
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
    <section className="relative min-h-[70vh] overflow-hidden bg-background">
      <Image
        src={PHOTOS.guest_kandura}
        alt="A guest in a white kandura recording against the navy studio backdrop — Podflix Studio, Business Bay Dubai"
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0" style={{ background: OVERLAY }} />

      <DubaiClock />

      <motion.p
        className="text-eyebrow absolute left-8 top-24 z-10 font-body text-gold md:left-16"
        style={{ letterSpacing: "0.4em" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 }}
      >
        PODFLIX / BOOKING
      </motion.p>

      <div className="absolute bottom-16 left-8 z-10 md:left-16">
        <motion.h1
          className="max-w-4xl font-display font-black leading-[0.85] tracking-[-0.03em] text-cream"
          style={{ fontSize: "clamp(52px, 9vw, 120px)" }}
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
          One session. A story that lasts forever.
        </motion.p>
      </div>
    </section>
  );
}
