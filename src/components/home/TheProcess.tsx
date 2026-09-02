"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { PHOTOS } from "@/lib/images";
import { useIsTouch } from "@/lib/useIsTouch";

type Step = {
  n: string;
  title: string;
  line: string;
  cta: string;
  href: string;
  src: string;
  alt: string;
  /** true → image on the left, content on the right (mirrored row). */
  reverse: boolean;
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Book.",
    line: "Pick your setup, choose your theme, reserve your slot in minutes.",
    cta: "Start booking",
    href: "/booking",
    src: PHOTOS.studio_cream_quattro,
    alt: "Four-seat panel podcast set with bouclé armchairs around the studio table — Podflix Studio, Business Bay Dubai",
    reverse: false,
  },
  {
    n: "02",
    title: "Record.",
    line: "Walk in. Sit down. Our operator handles cameras, sound, and lighting — you just talk.",
    cta: "See the studio",
    href: "/studio",
    src: PHOTOS.guest_amber,
    alt: "A podcast host recording at the studio table under warm amber light — Podflix Studio, Business Bay Dubai",
    reverse: true,
  },
  {
    n: "03",
    title: "Publish.",
    line: "Leave with raw footage or a fully edited, 4K-ready episode. Your story, out in the world.",
    cta: "View packages",
    href: "/pricing",
    src: PHOTOS.production_editor,
    alt: "A Podflix editor cutting a podcast episode in Premiere Pro — Podflix Studio, Business Bay Dubai",
    reverse: false,
  },
];

/** SSR-safe md+ check. Parallax is desktop-only — phones skip the work. */
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

// The image column is 45% of the viewport on desktop, full width stacked.
const IMAGE_SIZES = "(min-width: 768px) 45vw, 100vw";

const BLEED_CLASS = "absolute inset-0 md:-top-12 md:-bottom-12";

/**
 * Image layer that drifts ±40px across the row's travel.
 *
 * One of these mounts per step, so this is where the scroll listeners multiply
 * — hence its own component, never mounted on touch.
 */
function ParallaxImageLayer({
  target,
  children,
}: {
  target: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  return (
    <motion.div className={BLEED_CLASS} style={{ y: parallaxY }}>
      {children}
    </motion.div>
  );
}

/** Picks the drifting layer or a plain one, so hooks stay out of the plain path. */
function ParallaxWrapper({
  parallax,
  target,
  children,
}: {
  parallax: boolean;
  target: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  if (parallax) return <ParallaxImageLayer target={target}>{children}</ParallaxImageLayer>;
  return <div className={BLEED_CLASS}>{children}</div>;
}

function ProcessStep({ step }: { step: Step }) {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const isTouch = useIsTouch();
  const rowRef = useRef<HTMLDivElement>(null);
  const parallax = isDesktop && !reduce && !isTouch;

  // Content enters from whichever side of the row it occupies.
  const fromX = step.reverse ? 60 : -60;

  const stack: Variants = {
    hidden: {},
    // delayChildren lets the watermark land before the heading follows it in.
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : fromX },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
  };
  const rule: Variants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.7, ease: EASE_EXPO } },
  };

  return (
    <div
      ref={rowRef}
      className={`relative grid grid-cols-1 overflow-hidden md:min-h-[70vh] ${
        step.reverse ? "md:grid-cols-[45fr_55fr]" : "md:grid-cols-[55fr_45fr]"
      }`}
    >
      {/* ── IMAGE — stacked on top on mobile, side column on md+ ── */}
      <div
        className={`relative order-1 aspect-video overflow-hidden md:aspect-auto ${
          step.reverse ? "md:order-1" : "md:order-2"
        }`}
      >
        {/* Vertical bleed on md+ gives the parallax room to travel without
            exposing an edge; the row's overflow-hidden clips it. */}
        <ParallaxWrapper parallax={parallax} target={rowRef}>
          <motion.div
            className="relative h-full w-full"
            initial={reduce ? false : { scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: EASE_EXPO }}
          >
            <Image
              src={step.src}
              alt={step.alt}
              fill
              sizes={IMAGE_SIZES}
              quality={85}
              className="object-cover"
            />
          </motion.div>
        </ParallaxWrapper>

        {/* Melts into the content side — upward when stacked, sideways on md+. */}
        <div
          aria-hidden
          className={`absolute inset-0 bg-linear-to-t from-background to-transparent ${
            step.reverse ? "md:bg-linear-to-l" : "md:bg-linear-to-r"
          }`}
        />
      </div>

      {/* ── CONTENT ── */}
      <div
        className={`relative order-2 flex flex-col justify-center overflow-hidden px-8 py-16 md:py-20 md:pl-20 md:pr-16 ${
          step.reverse ? "md:order-2" : "md:order-1"
        }`}
      >
        {/* Layered step number, behind everything. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 -z-10 flex max-w-full select-none items-center overflow-hidden font-display text-[80px] font-black leading-none text-cream/[0.03] md:text-[220px] md:text-cream/[0.04]"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE_EXPO }}
        >
          {step.n}
        </motion.span>

        <motion.div
          className="relative z-10"
          variants={stack}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h3
            variants={item}
            className="font-display text-[clamp(48px,7vw,110px)] font-black leading-[0.85] text-cream"
          >
            {step.title}
          </motion.h3>

          <motion.span
            aria-hidden
            variants={rule}
            className="mt-6 block h-px w-12 origin-left bg-gold"
          />

          <motion.p
            variants={item}
            className="mt-4 max-w-sm font-body text-lg text-cream/50"
          >
            {step.line}
          </motion.p>

          <motion.div variants={item} className="mt-8">
            <Link
              href={step.href}
              className="group relative inline-flex min-h-11 items-center gap-2 py-1.5 font-body text-sm text-gold"
            >
              <span className="relative">
                {step.cta}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100"
                />
              </span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * The connecting thread that draws as you move through the steps.
 *
 * The line is `hidden md:block`, so on a phone this was a scroll listener and a
 * running spring feeding an element that is never painted. Now it is simply
 * not mounted there.
 */
function Thread({ target }: { target: React.RefObject<HTMLElement | null> }) {
  // 0 when the section's top reaches the viewport centre, 1 when its bottom
  // does — so the line draws as you move through steps.
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start center", "end center"],
  });
  const threadScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div className="h-full w-full origin-top bg-gold" style={{ scaleY: threadScale }} />
  );
}

export default function TheProcess() {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();
  const sectionRef = useRef<HTMLElement>(null);
  const drawThread = !reduce && !isTouch;

  return (
    <section ref={sectionRef} className="relative bg-background">
      {/* ── Connecting thread — desktop only, sits in the left gutter ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-10 z-20 hidden w-px bg-gold/20 md:block"
      >
        {drawThread ? (
          <Thread target={sectionRef} />
        ) : (
          <div className="h-full w-full origin-top bg-gold" />
        )}
      </div>

      {STEPS.map((step) => (
        <ProcessStep key={step.n} step={step} />
      ))}
    </section>
  );
}
