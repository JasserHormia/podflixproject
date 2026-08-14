"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";

/** One gallery cell with a hover overlay + label. Module-scope (stable identity). */
function GalleryTile({
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
      {/* hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="text-sm uppercase tracking-[0.25em] text-cream">Podflix Studio</span>
      </div>
    </div>
  );
}

const COL_SIZES = "(min-width: 768px) 33vw, 100vw";

export default function StudioGallery() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background">
      <motion.div
        className="grid grid-cols-1 md:h-screen md:grid-cols-[3fr_4fr_3fr]"
        initial={reduce ? false : { scale: 1.03 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: EASE_EXPO }}
      >
        {/* Col 1 */}
        <GalleryTile
          src={IMAGES.gallery_1}
          alt="Studio desk and equipment"
          sizes={COL_SIZES}
          className="min-h-[60vh] md:min-h-0"
        />

        {/* Col 2 */}
        <div className="flex flex-col">
          <GalleryTile
            src={IMAGES.gallery_2}
            alt="Podcast recording in session"
            sizes={COL_SIZES}
            className="min-h-[40vh] flex-1 md:min-h-0"
          />
          <GalleryTile
            src={IMAGES.gallery_6}
            alt="Two creators recording an interview"
            sizes={COL_SIZES}
            className="min-h-[40vh] flex-1 md:min-h-0"
          />
        </div>

        {/* Col 3 */}
        <div className="flex flex-col">
          <GalleryTile
            src={IMAGES.gallery_3}
            alt="Microphone close-up in warm light"
            sizes={COL_SIZES}
            className="min-h-[40vh] flex-[3] md:min-h-0"
          />
          <GalleryTile
            src={IMAGES.gallery_4}
            alt="Headphones resting on a studio desk"
            sizes={COL_SIZES}
            className="min-h-[30vh] flex-[2] md:min-h-0"
          />
        </div>
      </motion.div>

      {/* Overlay statement */}
      <motion.p
        className="pointer-events-none absolute bottom-8 left-8 z-10 max-w-2xl font-display text-3xl font-black text-cream/80 md:bottom-12 md:left-12 md:text-5xl"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE_EXPO }}
      >
        Every frame. Every word. Captured.
      </motion.p>
    </section>
  );
}
