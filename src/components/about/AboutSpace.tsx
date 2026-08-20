"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";

/** Image with a hover overlay + label. Module-scope for stable identity. */
function ImageTile({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
}) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} quality={85} className="object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="text-xs uppercase tracking-[0.25em] text-cream">Podflix Studio</span>
      </div>
    </div>
  );
}

const SIZES = "(min-width: 768px) 50vw, 100vw";

export default function AboutSpace() {
  const reduce = useReducedMotion();

  return (
    <section className="overflow-hidden bg-background">
      <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr]">
        {/* LEFT — stacked */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
          className="flex flex-col"
        >
          <ImageTile
            src={IMAGES.solo_1}
            alt="A host recording alone in the Solo setup"
            sizes={SIZES}
            className="aspect-video"
          />
          <div className="px-8 py-12">
            <h2 className="font-display text-4xl font-black text-cream md:text-5xl">
              The details matter.
            </h2>
            <p className="mt-4 max-w-sm font-body text-base text-cream/40">
              From acoustic panels to camera angles — every element of Podflix is
              designed to make your content look and sound world-class.
            </p>
          </div>
          <ImageTile
            src={IMAGES.duo_2}
            alt="The Duo setup in the navy panelled room"
            sizes={SIZES}
            className="aspect-square"
          />
        </motion.div>

        {/* RIGHT — full-height image */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
          className="relative min-h-[60vh] md:min-h-full"
        >
          <ImageTile
            src={IMAGES.quattro_3}
            alt="The Quattro setup arranged for a panel"
            sizes={SIZES}
            className="absolute inset-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
