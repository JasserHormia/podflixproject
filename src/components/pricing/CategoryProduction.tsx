"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";

const INCLUDES = [
  "1-hour studio recording",
  "Full podcast editing",
  "Multi-camera editing",
  "Audio enhancement",
  "Color grading",
  "4K export · YouTube format",
];

export default function CategoryProduction() {
  const reduce = useReducedMotion();

  return (
    <section className="grid min-h-[80vh] grid-cols-1 bg-gold md:grid-cols-2">
      {/* LEFT — image */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="relative min-h-[45vh] md:order-1 md:min-h-full"
      >
        <Image
          src={IMAGES.gallery_2}
          alt="Podcast recording in the studio"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={85}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to left, rgba(169,143,116,0.7) 0%, rgba(169,143,116,0) 55%)" }}
        />
      </motion.div>

      {/* RIGHT — content */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="relative flex flex-col justify-center bg-gold px-8 py-20 md:order-2 md:px-16 md:pr-16"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute right-8 top-8 select-none font-display text-[160px] font-black leading-none text-background/10"
        >
          02
        </span>

        <div className="relative">
          <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-background/50">
            Full Production
          </p>
          <h3
            className="font-display font-black leading-[0.85] text-background"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            Podcast Production
          </h3>
          <p className="mt-3 font-body text-lg text-background/70">
            Record it. Edit it. Publish it.
          </p>

          {/* Price */}
          <p className="mt-8 font-display text-5xl font-black text-background md:text-6xl">
            AED 1,500
          </p>
          <p className="mt-2 font-body text-base text-background/60">
            1-Hour Recording + Full Podcast Edit
          </p>

          {/* Includes */}
          <ul className="mt-8 max-w-md">
            {INCLUDES.map((inc) => (
              <li
                key={inc}
                className="flex items-center justify-between border-b border-background/20 py-3"
              >
                <span className="font-body text-sm text-background">{inc}</span>
                <span aria-hidden className="text-background">
                  ✓
                </span>
              </li>
            ))}
          </ul>

          {/* Upsell */}
          <div className="mt-8 max-w-md rounded-none border border-background/20 bg-background/10 p-6">
            <p className="font-display text-lg font-semibold text-background">
              🎬 Amplify your reach
            </p>
            <p className="mt-1 font-body text-sm text-background/60">
              Add 3 Reels Edit to this package
            </p>
            <p className="mt-3 font-display text-2xl font-black text-background">
              + AED 900 · Total: AED 2,400
            </p>
            <a
              href="https://wa.me/971565343070"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-3 inline-block font-display text-sm text-background/70 transition-colors hover:text-background"
            >
              Add this when booking →
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-background transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
