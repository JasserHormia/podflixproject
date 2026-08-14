"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";

export default function TheClose() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gold">
      {/* Oversized wordmark bleeding off the bottom edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-[18%] select-none text-center font-display text-[20vw] font-black leading-none text-background/20"
      >
        PODFLIX
      </span>

      {/* Center statement + underline-draw CTA */}
      <motion.div
        className="relative z-10 px-6 text-center"
        initial={reduce ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE_EXPO }}
      >
        <h2 className="font-display text-5xl font-black leading-tight text-background md:text-7xl">
          Your story starts today.
        </h2>

        <Link
          href="/booking"
          className="group relative mt-10 inline-block font-display text-xl font-black text-background"
        >
          Book a Session
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-background transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
        </Link>
      </motion.div>

      {/* Corner attribution — replaces the footer on home */}
      <p className="absolute bottom-6 right-6 z-10 text-xs text-background/40 sm:right-10">
        © 2026 Podflix · MCFLIX Agency
      </p>
    </section>
  );
}
