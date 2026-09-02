"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { useIsTouch } from "@/lib/useIsTouch";
import { FROM_PRICE, formatPrice } from "@/lib/booking";
import IMAGES from "@/lib/images";
import TextWipe from "@/components/ui/TextWipe";
import MagneticButton from "@/components/ui/MagneticButton";

// Warm gold gradient — top-lit, falling to a deeper tone at the base.
const GOLD_WASH =
  "linear-gradient(180deg, #B29877 0%, #A98F74 45%, #967D63 100%)";

// Same fractal-noise grain used elsewhere on the site — paper/film texture.
const NOISE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/></svg>`
);
const grainStyle = {
  backgroundImage: `url("data:image/svg+xml,${NOISE}")`,
  backgroundSize: "120px 120px",
};

/** SSR-safe md+ check — the watermark parallax is desktop-only. */
function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false
  );
}

const WATERMARK_CLASS =
  "pointer-events-none absolute inset-x-0 bottom-[-3vw] select-none text-center font-display text-[25vw] font-black leading-none text-background/[0.08] md:text-[20vw]";

/**
 * Wordmark that drifts ~60px up as the section arrives. Owns the only
 * useScroll here, so touch mounts the static span instead and no scroll
 * listener is attached.
 */
function ParallaxWatermark({ target }: { target: React.RefObject<HTMLElement | null> }) {
  // This is the last section on the page, so it never scrolls back out of the
  // viewport — an "end start" range would leave half the drift unreachable.
  // "end end" completes exactly as the section finishes scrolling into view.
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end end"] });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  return (
    <motion.span aria-hidden style={{ y: watermarkY }} className={WATERMARK_CLASS}>
      PODFLIX
    </motion.span>
  );
}

export default function TheClose() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const isTouch = useIsTouch();
  const sectionRef = useRef<HTMLElement>(null);
  const parallax = isDesktop && !reduce && !isTouch;

  return (
    <section
      ref={sectionRef}
      // `isolate` keeps the blend modes below from reaching earlier sections.
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-32 pt-24 md:pb-24"
      style={{ background: GOLD_WASH }}
    >
      {/* Ghost photo — barely there, just enough to break the flat field */}
      <Image
        aria-hidden
        src={IMAGES.duo_1}
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className="pointer-events-none absolute inset-0 select-none object-cover opacity-[0.07] mix-blend-multiply"
      />

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
        style={grainStyle}
      />

      {/* Oversized wordmark bleeding off the bottom edge */}
      {parallax ? (
        <ParallaxWatermark target={sectionRef} />
      ) : (
        <span aria-hidden className={WATERMARK_CLASS}>
          PODFLIX
        </span>
      )}

      {/* ── Centre stack ── */}
      <div className="relative z-10 w-full max-w-4xl text-center">
        <TextWipe
          text={["Your Story", "Starts Today."]}
          as="h2"
          inline
          className="font-display text-[clamp(52px,8vw,120px)] font-black leading-[0.85] text-background"
          stagger={0.18}
          duration={0.9}
        />

        <motion.p
          className="mt-6 font-body text-lg text-background/80"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.35 }}
        >
          Solo, Duo, or Quattro — your set is ready.
        </motion.p>

        <motion.div
          // items-stretch lets the button fill the column on phones; from sm up
          // it collapses back to its natural width.
          className="mt-12 flex flex-col items-stretch sm:items-center"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.5 }}
        >
          <MagneticButton
            href="/booking"
            className="group mx-auto block w-full max-w-sm rounded-none bg-background px-12 py-6 text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-cream transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-[#111009] sm:w-auto"
          >
            Book a Session
            <span
              aria-hidden
              className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </MagneticButton>

          <p className="mt-6 text-xs uppercase tracking-widest text-background/80">
            Free reschedule up to 24h · Sessions from {formatPrice(FROM_PRICE)}
          </p>
        </motion.div>
      </div>

      {/* Gentle vignette over the bottom band. The multiply-blended ghost photo
          drags this area down to ~#635341, where neither ink nor cream clears
          AA on its own; deepening it slightly lets cream pass with margin.
          Consistent with the global vignette in Grain.tsx. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48 bg-linear-to-t from-background/40 to-transparent"
      />

      {/* ── Section meta — stacked above the mobile chrome, split on md+ ──
           A <footer>, not a <div>: the shared Footer component deliberately
           renders nothing on the homepage (this panel replaces it), which left
           the page with no contentinfo landmark at all. This strip already
           carries the copyright and location, so it is the footer in
           everything but name. Purely semantic — nothing moves. */}
      <footer className="absolute inset-x-0 bottom-24 z-10 flex flex-col items-center gap-2 px-6 text-center text-xs text-cream md:bottom-6 md:flex-row md:justify-between md:px-10 md:text-left">
        <p>© 2026 Podflix · MCFLIX Agency</p>
        {/* The WhatsApp pill occupies ~182px from the right edge on md+, so the
            reserve has to exceed that plus the container's own px-10. */}
        <p className="md:pr-48">Dubai · Business Bay</p>
      </footer>
    </section>
  );
}
