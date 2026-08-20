"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";

const EQUIPMENT = [
  { name: "Shure SM7B", spec: "×4 Microphones" },
  { name: "Rodecaster Pro II", spec: "Professional Mixer" },
  { name: "Sony FX3", spec: "Cinema Camera" },
  { name: "Aputure 300x", spec: "LED Lighting" },
  { name: "Acoustic Panels", spec: "Full Room Treatment" },
  { name: "4K HDMI", spec: "Capture Cards" },
  { name: "1Gbps WiFi", spec: "High-Speed Internet" },
  { name: '65" Monitor', spec: "Reference Display" },
];

// bg-teal (#23333b) → transparent, so the image bleeds into the left column.
const BLEED = "linear-gradient(to right, #23333b 0%, rgba(35,51,59,0) 45%)";

export default function StudioEquipment() {
  const reduce = useReducedMotion();

  const list: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };
  const row: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_EXPO } },
  };

  return (
    <section className="relative bg-teal">
      {/* Top full-width gold line */}
      <motion.span
        aria-hidden
        className="block h-px w-full origin-left bg-gold"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.9 }}
        transition={{ duration: 1.2, ease: EASE_EXPO }}
      />

      <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr]">
        {/* LEFT — heading + equipment rows */}
        <div className="px-8 py-20 md:px-16">
          <div className="relative overflow-hidden">
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 font-display text-[200px] font-black leading-none text-cream/[0.03]"
            >
              GEAR
            </span>
            <h2
              className="relative font-display font-black leading-[0.85] text-cream"
              style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
            >
              What&apos;s Inside
            </h2>
          </div>

          <motion.ul
            className="mt-12"
            variants={list}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {EQUIPMENT.map((item) => (
              <motion.li
                key={item.name}
                variants={row}
                className="group flex items-center justify-between gap-4 border-b border-cream/10 px-2 py-6 transition-colors duration-300 hover:bg-surface/50"
              >
                <span className="font-display text-xl font-semibold text-cream transition-colors duration-300 group-hover:text-gold md:text-2xl">
                  {item.name}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-sm uppercase tracking-widest text-gold">
                    {item.spec}
                  </span>
                  <span
                    aria-hidden
                    className="text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    →
                  </span>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* RIGHT — full-height image bleeding into the column */}
        <div className="relative min-h-[50vh] md:min-h-full">
          <Image
            src={IMAGES.duo_2}
            alt="The Duo setup in the navy panelled room"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            quality={85}
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0" style={{ background: BLEED }} />
        </div>
      </div>
    </section>
  );
}
