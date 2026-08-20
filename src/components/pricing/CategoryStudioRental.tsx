"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";

type Rate = { duration: string; price: string; recommended: boolean };

const RATES: Rate[] = [
  { duration: "1 Hour", price: "AED 650", recommended: false },
  { duration: "2 Hours", price: "AED 1,250", recommended: true },
  { duration: "3 Hours", price: "AED 1,800", recommended: false },
  { duration: "4 Hours", price: "AED 2,300", recommended: false },
  { duration: "5 Hours", price: "AED 2,750", recommended: false },
  { duration: "8 Hours", price: "AED 4,200", recommended: false },
  { duration: "12 Hours", price: "AED 6,000", recommended: false },
];

const INCLUDES = [
  "Premium podcast studio",
  "3-camera cinematic setup",
  "Professional lighting",
  "Professional audio",
  "Studio operator",
  "Raw footage delivery · 12 themed sets across Solo, Duo & Quattro",
];

export default function CategoryStudioRental() {
  const reduce = useReducedMotion();

  return (
    <section className="grid min-h-screen grid-cols-1 bg-surface md:grid-cols-2">
      {/* LEFT — content */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="relative flex flex-col justify-center bg-surface px-8 py-20 md:px-16"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-8 top-8 select-none font-display text-[160px] font-black leading-none text-cream/5"
        >
          01
        </span>

        <div className="relative">
          <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-gold/60">
            Raw Footage
          </p>
          <h3
            className="font-display font-black leading-[0.85] text-cream"
            style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
          >
            Studio Rental
          </h3>
          <p className="mt-4 max-w-sm font-body text-lg text-cream/50">
            The space. The gear. The operator. You bring the ideas.
          </p>

          {/* Hourly rates */}
          <div className="mt-10 max-w-md">
            {RATES.map((rate) => (
              <div
                key={rate.duration}
                className="flex items-center justify-between border-b border-cream/10 py-4"
              >
                <span className="flex items-center font-display text-lg font-semibold text-cream">
                  {rate.duration}
                  {rate.recommended && (
                    <span className="ml-3 rounded-none bg-gold px-2 py-0.5 text-[8px] uppercase tracking-widest text-background">
                      Recommended
                    </span>
                  )}
                </span>
                <span className="font-display text-xl font-black text-gold">{rate.price}</span>
              </div>
            ))}
          </div>

          {/* Includes */}
          <p className="mt-8 text-[9px] uppercase tracking-widest text-cream/30">
            What&apos;s included:
          </p>
          <div className="mt-4 grid max-w-md grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {INCLUDES.map((inc) => (
              <span key={inc} className="flex items-start gap-2 font-body text-sm text-cream/60">
                <span aria-hidden className="text-gold">
                  ✓
                </span>
                {inc}
              </span>
            ))}
          </div>

          {/* Upsell */}
          <div className="mt-8 max-w-md rounded-none border border-gold/30 bg-gold/10 p-6">
            <p className="font-display text-lg font-semibold text-cream">
              🎬 Want edited content too?
            </p>
            <p className="mt-1 font-body text-sm text-cream/60">
              Add 3 Reels Edit to any rental package
            </p>
            <p className="mt-3 font-display text-2xl font-black text-gold">+ AED 900</p>
            <a
              href="https://wa.me/971565343070"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-3 inline-block font-display text-sm text-gold"
            >
              Ask us about this when booking →
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </a>
          </div>
        </div>
      </motion.div>

      {/* RIGHT — image */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="relative min-h-[45vh] md:min-h-full"
      >
        <Image
          src={IMAGES.solo_3}
          alt="The Solo setup — boom microphone over an armchair"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={85}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(17,16,9,0.8) 0%, rgba(17,16,9,0) 55%)" }}
        />
      </motion.div>
    </section>
  );
}
