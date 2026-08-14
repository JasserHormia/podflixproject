"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";
import TextWipe from "@/components/ui/TextWipe";
import MagneticButton from "@/components/ui/MagneticButton";

export default function PricingClose() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <Image
        src={IMAGES.hero_recording}
        alt=""
        fill
        sizes="100vw"
        quality={85}
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0" style={{ background: "rgba(10,8,7,0.85)" }} />

      <div className="relative z-10 px-6 text-center">
        <TextWipe
          as="h2"
          inline
          text={["Stop", "thinking", "about", "it."]}
          className="font-display text-[clamp(48px,7vw,96px)] font-black leading-[0.85] tracking-[-0.02em] text-cream"
        />

        <motion.p
          className="mt-6 font-body text-xl text-gold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.4 }}
        >
          Sessions from AED 650. Your audience is waiting.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.6 }}
        >
          <MagneticButton
            href="/booking"
            className="inline-block rounded-none bg-gold px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors duration-300 hover:bg-cream"
          >
            Book a Session →
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
