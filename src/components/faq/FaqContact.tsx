"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import MagneticButton from "@/components/ui/MagneticButton";
import AudioWaveform from "@/components/ui/AudioWaveform";

export default function FaqContact() {
  const reduce = useReducedMotion();

  return (
    <section className="grid min-h-[50vh] grid-cols-1 bg-teal md:grid-cols-2">
      {/* LEFT — talk to us */}
      <motion.div
        className="flex flex-col justify-center px-8 py-20 md:px-16"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
      >
        <h2 className="font-display text-5xl font-black leading-[0.85] text-cream md:text-6xl">
          Still not sure?
        </h2>
        <p className="mt-6 max-w-sm font-body text-lg text-cream/50">
          Talk to us directly. Real people, real answers.
        </p>

        <div className="mt-10">
          <MagneticButton
            href="https://wa.me/971565343070"
            className="inline-block rounded-none bg-gold px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors duration-300 hover:bg-cream"
          >
            WhatsApp Us →
          </MagneticButton>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-cream/20">
            Average response time: under 5 minutes
          </p>
        </div>
      </motion.div>

      {/* RIGHT — living waveform */}
      <div className="flex flex-col items-center justify-center gap-6 px-8 py-20">
        <AudioWaveform barClassName="bg-gold/30" className="h-20" />
        <p className="text-xs uppercase tracking-[0.2em] text-cream/20">We&apos;re here.</p>
      </div>
    </section>
  );
}
