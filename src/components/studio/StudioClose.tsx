"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";

export default function StudioClose() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gold">
      {/* Image reads as texture beneath the dominant gold */}
      <Image
        src={IMAGES.hero_recording}
        alt=""
        fill
        sizes="100vw"
        quality={85}
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-gold/70 mix-blend-multiply" />

      <motion.div
        className="relative z-10 px-6 text-center"
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE_EXPO }}
      >
        <h2 className="font-display text-5xl font-black leading-tight text-background md:text-8xl">
          Ready to Record?
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-body text-xl text-background/70">
          Book your session. Show up. We handle the rest.
        </p>

        <Link
          href="/booking"
          className="group relative mt-10 inline-block font-body text-xl font-bold text-background"
        >
          Book a Session →
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-background transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
        </Link>
      </motion.div>
    </section>
  );
}
