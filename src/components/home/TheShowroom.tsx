"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES, { PHOTOS } from "@/lib/images";

// Inline SVG noise — grain texture with no external asset.
const NOISE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/></svg>`
);
const grainStyle = {
  backgroundImage: `url("data:image/svg+xml,${NOISE}")`,
  backgroundSize: "120px 120px",
};

// Right column photo slots — one per setup, top to bottom.
const SLOTS = [
  { src: PHOTOS.studio_cream_duo, alt: "Cream podcast set with two bouclé armchairs and Shure boom microphones — Podflix Studio, Business Bay Dubai" },
  { src: IMAGES.solo_1, alt: "The Solo setup — a host recording alone" },
  { src: PHOTOS.studio_cream_quattro, alt: "Four-seat panel podcast set with bouclé armchairs around the studio table — Podflix Studio, Business Bay Dubai" },
];

// Each column is ~half the viewport on desktop, full width on mobile.
const SIZES = "(min-width: 768px) 50vw, 100vw";

export default function TheShowroom() {
  const reduce = useReducedMotion();

  const slot: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_EXPO } },
  };

  return (
    <section className="relative bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — the anchor panel */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE_EXPO }}
          className="relative flex min-h-[60vh] items-end overflow-hidden bg-surface md:min-h-screen"
        >
          <Image
            src={IMAGES.quattro_1}
            alt="The Quattro setup — four seats and microphones around the studio table"
            fill
            sizes={SIZES}
            quality={85}
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={grainStyle} />
          <span className="relative p-6 font-display text-[14vw] font-black leading-none text-cream/20 sm:p-10 md:text-[9vw]">
            The Setups
          </span>
        </motion.div>

        {/* Right — stacked photo slots */}
        <motion.div
          className="flex flex-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {SLOTS.map((photo) => (
            <motion.div
              key={photo.src}
              variants={slot}
              className="relative flex min-h-[30vh] flex-1 items-center justify-center overflow-hidden border-t border-border bg-surface first:border-t-0 md:min-h-[33.333vh]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={SIZES}
                quality={85}
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={grainStyle} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Single corner link */}
      <Link
        href="/studio"
        className="group absolute bottom-5 right-6 z-10 inline-flex min-h-11 items-center gap-2 py-1.5 font-body text-sm text-gold sm:right-10"
      >
        See everything
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
        >
          →
        </span>
      </Link>
    </section>
  );
}
