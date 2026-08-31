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
  /** One shot per themed set design. First entry is the block's default. */
  shots: Shot[];
  /** true → content on the left, image on the right. */
  reverse: boolean;
};

/**
 * Three formats, each offering several themed set designs. The theme count in
 * the badge is derived from `shots.length`, so the copy can never drift from
 * the number of frames actually shown. Totals 7 + 3 + 2 = the 12 themed sets
 * quoted across the site.
 */
const SETUPS: Setup[] = [
  {
    index: "01",
    name: "Solo.",
    blurb:
      "One voice. Full focus. 7 themed sets to match your brand — from minimal to bold.",
    shots: [
      { src: IMAGES.solo_1, alt: "Solo podcast recording set in the navy panelled room — Podflix Studio, Business Bay Dubai" },
      { src: IMAGES.solo_2, alt: "Minimal solo podcast desk set under warm slatted light — Podflix Studio Dubai" },
      { src: IMAGES.solo_3, alt: "Solo lounge podcast set with boom microphone and floor lamp — Podflix Studio, Business Bay Dubai" },
      { src: IMAGES.solo_4, alt: "Moody solo podcast set with patterned backlight and salt lamp — Podflix Studio Dubai" },
      { src: IMAGES.solo_4b, alt: "Bright editorial solo podcast set beneath a gold orb lamp — Podflix Studio Dubai" },
      { src: IMAGES.solo_5, alt: "Focused solo podcast desk set with a vertical light strip — Podflix Studio, Business Bay Dubai" },
      { src: IMAGES.solo_5b, alt: "Clean solo podcast table set against the slatted wall and bookshelf — Podflix Studio Dubai" },
    ],
    reverse: false,
  },
  {
    index: "02",
    name: "Duo.",
    blurb:
      "Two chairs. Real conversation. 3 themed sets built for interviews and co-hosted shows.",
    shots: [
      { src: IMAGES.duo_1, alt: "Duo interview podcast set with two warm lounge armchairs and boom microphones — Podflix Studio Dubai" },
      { src: IMAGES.duo_2, alt: "Formal duo interview podcast set in the navy panelled room — Podflix Studio, Business Bay Dubai" },
      { src: IMAGES.duo_3, alt: "Modern duo podcast set at the studio table — Podflix Studio Dubai" },
    ],
    reverse: true,
  },
  {
    index: "03",
    name: "Quattro.",
    blurb:
      "Four seats. Full panel energy. 2 cinematic sets for roundtables and group shows.",
    // Two frames, matching Quattro's two themes — the delivered quattro-03 is
    // byte-identical to quattro-02, so listing it would duplicate a thumbnail
    // and contradict the badge.
    shots: [
      { src: IMAGES.quattro_1, alt: "Four-person panel podcast set around the studio table — Podflix Studio, Business Bay Dubai" },
      { src: IMAGES.quattro_2, alt: "Four-person panel podcast set with four lounge armchairs — Podflix Studio Dubai" },
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
              alt={shot.alt}
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

        <motion.div variants={item}>
          <span className="inline-block border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
            {setup.shots.length} Themes Available
          </span>
        </motion.div>

        {/* One thumbnail per theme. Scrolls horizontally when the row overflows
            its column — Solo's seven never fit. The active shot stays in the
            strip so you can always get back to it. */}
        <motion.div
          variants={item}
          className="-mx-8 mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto px-8 pb-3 md:-mx-12 md:px-12"
        >
          {setup.shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`Show ${setup.name.replace(".", "")} theme ${i + 1} of ${
                setup.shots.length
              }`}
              className={`relative aspect-video w-32 shrink-0 snap-start overflow-hidden rounded-sm ring-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                i === active
                  ? "opacity-100 ring-gold"
                  : "opacity-50 ring-cream/10 hover:opacity-80 hover:ring-cream/30"
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
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
    // overflow-x-clip contains the thumbnail strip's -mx-8/-mx-12: the strip
    // scrolls internally by design, but without a clip here its negative margin
    // escapes and widens the whole document (500 -> 564 at a 500px viewport).
    <section className="relative overflow-x-clip bg-background">
      {/* Section header */}
      <div className="px-8 py-24 md:px-16 md:py-32">
        <TextWipe
          text="Choose Your Setup."
          as="h2"
          className="font-display text-[clamp(40px,6vw,80px)] font-black leading-[0.9] text-cream"
          duration={0.9}
        />
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-gold">
          Three formats. Twelve themed sets. One standard: cinematic.
        </p>
      </div>

      {SETUPS.map((setup) => (
        <SetupBlock key={setup.name} setup={setup} />
      ))}
    </section>
  );
}
