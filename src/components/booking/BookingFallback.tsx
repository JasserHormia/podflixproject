"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";
import MagneticButton from "@/components/ui/MagneticButton";

export default function BookingFallback() {
  const reduce = useReducedMotion();

  return (
    // overflow-hidden clips the columns' ±60px entry offset — without it the
    // page scrolls sideways until this section animates in.
    <section className="grid min-h-[50vh] grid-cols-1 overflow-hidden bg-background md:grid-cols-2">
      {/* LEFT — the soft off-ramp */}
      <motion.div
        className="flex flex-col justify-center px-8 py-20 md:px-16"
        initial={reduce ? false : { opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
      >
        <h2 className="font-display text-5xl font-black leading-[0.9] text-cream md:text-6xl">
          Not sure yet?
        </h2>
        <p className="mt-6 max-w-sm font-body text-lg text-cream/50">
          Talk to us first. No pressure, no pitch — just a conversation about your
          project.
        </p>

        <div className="mt-10">
          <MagneticButton
            href="https://wa.me/971565343070"
            className="inline-block rounded-none bg-gold px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors duration-300 hover:bg-cream"
          >
            Chat on WhatsApp →
          </MagneticButton>
          <p className="mt-4 text-sm text-cream/30">
            Or email us at{" "}
            <a
              href="mailto:hello@podflix.ae"
              className="text-cream/50 transition-colors hover:text-gold"
            >
              hello@podflix.ae
            </a>
          </p>
        </div>
      </motion.div>

      {/* RIGHT — image */}
      <motion.div
        className="relative min-h-[45vh] md:min-h-full"
        initial={reduce ? false : { opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
      >
        <Image
          src={IMAGES.solo_2}
          alt="Microphone on the Solo desk at Podflix"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={85}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,8,7,0.6) 0%, rgba(10,8,7,0) 55%)",
          }}
        />
      </motion.div>
    </section>
  );
}
