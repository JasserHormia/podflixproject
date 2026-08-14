"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";

const STATEMENTS = [
  {
    heading: <>We built the studio we always wished existed.</>,
    body: "Dubai needed a space where creators could walk in with an idea and walk out with a masterpiece. So we built it.",
  },
  {
    heading: <>Professional doesn&apos;t have to mean complicated.</>,
    body: "We stripped away everything that gets in the way of great content — and kept only what makes it exceptional.",
  },
  {
    heading: (
      <>
        Your story is worth telling <span className="text-gold">well.</span>
      </>
    ),
    body: "Whether you're a brand, a creator, or someone with a story to share — this studio was built for you.",
  },
];

export default function AboutStory() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_EXPO } },
  };

  return (
    <section className="bg-background px-8 py-24 md:px-16">
      <p className="mb-12 text-[10px] uppercase tracking-[0.5em] text-gold/40">Our Story</p>

      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[65fr_35fr] md:gap-16">
        {/* LEFT — statements */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {STATEMENTS.map((s, i) => (
            <motion.div key={i} variants={item} className="border-b border-cream/10 py-8">
              <h2 className="font-display text-3xl font-semibold text-cream md:text-4xl">
                {s.heading}
              </h2>
              <p className="mt-3 max-w-lg font-body text-base text-cream/50">{s.body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* RIGHT — sticky image (desktop) */}
        <div className="md:sticky md:top-[10%]">
          <div className="relative min-h-[50vh] overflow-hidden md:min-h-[80vh]">
            <Image
              src={IMAGES.hero_recording}
              alt="A creator recording at Podflix"
              fill
              sizes="(min-width: 768px) 35vw, 100vw"
              quality={85}
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to left, rgba(10,8,7,0) 0%, rgba(10,8,7,0.3) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
