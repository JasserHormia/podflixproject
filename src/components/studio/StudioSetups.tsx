"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";
import TextWipe from "@/components/ui/TextWipe";

type Shot = { src: string; alt: string };

type Setup = {
  index: string;
  name: string;
  blurb: string;
  /** First entry is the default hero shot for the block. */
  shots: Shot[];
  /** true → content on the left, image on the right. */
  reverse: boolean;
};

const SETUPS: Setup[] = [
  {
    index: "01",
    name: "Solo.",
    blurb:
      "One voice. Full focus. Perfect for solo shows, monologues, and personal brands.",
    shots: [
      { src: IMAGES.solo_1, alt: "A host recording alone in the Solo setup" },
      { src: IMAGES.solo_2, alt: "Microphone on the Solo desk, lit by warm slatted light" },
      { src: IMAGES.solo_3, alt: "Boom microphone over the Solo armchair" },
    ],
    reverse: false,
  },
  {
    index: "02",
    name: "Duo.",
    blurb:
      "Two chairs. Real conversation. Built for interviews and co-hosted shows.",
    shots: [
      { src: IMAGES.duo_1, alt: "Two armchairs and boom microphones in the Duo setup" },
      { src: IMAGES.duo_2, alt: "The Duo setup in the navy panelled room" },
      { src: IMAGES.duo_3, alt: "The Duo setup at the studio table" },
    ],
    reverse: true,
  },
  {
    index: "03",
    name: "Quattro.",
    blurb:
      "Four seats. Full panel energy. Roundtables, podcasts with guests, and team shows.",
    // Only two distinct Quattro frames were delivered — quattro-03 is
    // byte-identical to quattro-02, so pairing them here would render the same
    // thumbnail twice. Add the third shot back when the client supplies one.
    shots: [
      { src: IMAGES.quattro_1, alt: "Four seats and microphones around the Quattro table" },
      { src: IMAGES.quattro_2, alt: "Four armchairs arranged for a Quattro panel" },
    ],
    reverse: false,
  },
];

const MAIN_SIZES = "(min-width: 768px) 60vw, 100vw";

function SetupBlock({ setup }: { setup: Setup }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  // Image enters from whichever edge it sits on; content always rises.
  const fromEdge = setup.reverse ? 64 : -64;

  const content: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
  };

  return (
    <div className="grid min-h-[80vh] grid-cols-1 md:grid-cols-[3fr_2fr]">
      {/* IMAGE */}
      <motion.div
        className={`relative min-h-[55vh] overflow-hidden bg-surface md:min-h-full ${
          setup.reverse ? "md:order-2" : ""
        }`}
        initial={reduce ? false : { opacity: 0, x: fromEdge }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1, ease: EASE_EXPO }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.4, ease: EASE_EXPO }}
        >
          {/* All shots stay mounted and cross-fade — no flash on swap. */}
          {setup.shots.map((shot, i) => (
            <Image
              key={shot.src}
              src={shot.src}
              alt={i === active ? shot.alt : ""}
              aria-hidden={i !== active}
              fill
              sizes={MAIN_SIZES}
              quality={85}
              className={`object-cover transition-opacity duration-700 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* CONTENT */}
      <motion.div
        className={`flex flex-col justify-center gap-6 bg-background px-8 py-16 md:px-12 md:py-20 ${
          setup.reverse ? "md:order-1" : ""
        }`}
        variants={content}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.span
          variants={item}
          className="text-[10px] uppercase tracking-[0.4em] text-gold/40"
        >
          {setup.index} / Setup
        </motion.span>

        <motion.h3
          variants={item}
          className="font-display text-6xl font-black leading-[0.9] text-cream md:text-8xl"
        >
          {setup.name}
        </motion.h3>

        <motion.p variants={item} className="max-w-sm text-lg text-cream/50">
          {setup.blurb}
        </motion.p>

        {/* Thumbnail strip — includes the default shot so you can always
            get back to it. */}
        <motion.div variants={item} className="mt-2 flex flex-wrap gap-3">
          {setup.shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`Show ${setup.name.replace(".", "")} view ${i + 1}`}
              className={`relative aspect-video w-32 shrink-0 overflow-hidden rounded-sm ring-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                i === active
                  ? "opacity-100 ring-gold"
                  : "opacity-50 ring-cream/10 hover:opacity-80 hover:ring-cream/30"
              }`}
            >
              <Image
                src={shot.src}
                alt=""
                fill
                sizes="128px"
                quality={75}
                className="object-cover"
              />
            </button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function StudioSetups() {
  return (
    <section className="relative bg-background">
      {/* Section header */}
      <div className="px-8 py-24 md:px-16 md:py-32">
        <TextWipe
          text="Choose Your Setup."
          as="h2"
          className="font-display text-[clamp(40px,6vw,80px)] font-black leading-[0.9] text-cream"
          duration={0.9}
        />
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-gold">
          Three configurations. One standard: cinematic.
        </p>
      </div>

      {SETUPS.map((setup) => (
        <SetupBlock key={setup.name} setup={setup} />
      ))}
    </section>
  );
}
