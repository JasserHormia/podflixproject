"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";

const COMMON =
  "Animated captions · Motion graphics · 3-cam production · 10 premium sets · Cinematic color grading";

type Pkg = {
  name: string;
  price: string;
  reels: string;
  badge?: string;
  highlighted?: boolean;
};

const PACKAGES: Pkg[] = [
  { name: "1 Hr + 3 Reels", price: "AED 1,700", reels: "3 edited reels" },
  {
    name: "1 Hr + 5 Reels",
    price: "AED 2,300",
    reels: "5 edited reels",
    badge: "Best Value",
    highlighted: true,
  },
  { name: "2 Hrs + 10 Reels", price: "AED 4,900", reels: "10 edited reels" },
];

export default function CategoryReels() {
  const reduce = useReducedMotion();

  return (
    <section className="grid min-h-screen grid-cols-1 bg-teal md:grid-cols-2">
      {/* LEFT — content */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="relative flex flex-col justify-center bg-teal px-8 py-20 md:order-1 md:px-16"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-8 top-8 select-none font-display text-[160px] font-black leading-none text-cream/5"
        >
          03
        </span>

        <div className="relative">
          <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-gold/60">
            Content Packages
          </p>
          <h3
            className="font-display font-black leading-[0.85] text-cream"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            Podcast + Reels
          </h3>
          <p className="mt-3 font-body text-lg text-cream/50">
            Record. Edit. Dominate social.
          </p>

          {/* Sub-tier cards */}
          <AnimatedSection stagger as="div" className="mt-8 max-w-lg space-y-4">
            {PACKAGES.map((pkg) => (
              <AnimatedItem key={pkg.name}>
                <div
                  className={`rounded-none border p-6 transition-colors duration-300 hover:border-gold/60 hover:bg-surface/70 ${
                    pkg.highlighted
                      ? "border-gold/40 bg-gold/20"
                      : "border-cream/10 bg-surface/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center font-display text-lg font-semibold text-cream">
                      {pkg.name}
                      {pkg.badge && (
                        <span className="ml-2 rounded-none bg-gold px-2 py-0.5 text-[8px] uppercase tracking-widest text-background">
                          {pkg.badge}
                        </span>
                      )}
                    </span>
                    <span className="font-display text-xl font-black text-gold">{pkg.price}</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-cream/50">
                    {pkg.reels} · {COMMON}
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </motion.div>

      {/* RIGHT — image */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className="relative min-h-[45vh] md:order-2 md:min-h-full"
      >
        <Image
          src={IMAGES.card_session}
          alt="A recording session in progress"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={85}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(35,51,59,0.8) 0%, rgba(35,51,59,0) 55%)" }}
        />
      </motion.div>
    </section>
  );
}
