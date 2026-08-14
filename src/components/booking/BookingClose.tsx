"use client";

import { motion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import TextWipe from "@/components/ui/TextWipe";
import MagneticButton from "@/components/ui/MagneticButton";
import AudioWaveform from "@/components/ui/AudioWaveform";

export default function BookingClose() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Living audio waveform background */}
      <AudioWaveform
        barClassName="bg-gold/40"
        className="pointer-events-none absolute inset-0 opacity-70"
      />

      <div className="relative z-10 px-6 text-center">
        <TextWipe
          as="h2"
          inline
          text={["Your", "story", "starts", "now."]}
          className="font-display text-[clamp(48px,7vw,96px)] font-black leading-[0.85] tracking-[-0.02em] text-cream"
        />

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.5 }}
        >
          <MagneticButton
            href="/booking#book"
            className="inline-block rounded-none bg-gold px-10 py-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors duration-300 hover:bg-cream"
          >
            Book Your Session
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
