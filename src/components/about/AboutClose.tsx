"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";
import TextWipe from "@/components/ui/TextWipe";
import MagneticButton from "@/components/ui/MagneticButton";

export default function AboutClose() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gold">
      <Image
        src={IMAGES.duo_1}
        alt=""
        fill
        sizes="100vw"
        quality={85}
        className="object-cover opacity-10 mix-blend-multiply"
      />

      <div className="relative z-10 px-6 text-center">
        <TextWipe
          as="h2"
          inline
          text={["Ready", "to", "tell", "your", "story?"]}
          className="font-display text-[clamp(48px,8vw,110px)] font-black leading-[0.82] tracking-[-0.02em] text-background"
        />

        <motion.p
          className="mt-6 font-body text-xl text-background/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.4 }}
        >
          The studio is waiting.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.55 }}
        >
          <MagneticButton
            href="/booking"
            className="inline-block rounded-none bg-background px-10 py-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:bg-surface"
          >
            Book a Session
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
