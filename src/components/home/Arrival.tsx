"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { LOGO_SRC, SERVICES_LINE } from "@/lib/brand";
import HeroVideo from "./HeroVideo";

const WORDMARK = "PODFLIX".split("");
const HEADLINE = ["Every", "Story", "Starts", "Here."];

/** The self-drawing gold underline used by the corner CTA. */
function DrawUnderline({ show }: { show: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="absolute -bottom-1 left-0 h-px w-full origin-left bg-gold"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: show ? 1 : 0 }}
      transition={{ duration: 0.9, ease: EASE_EXPO, delay: show ? 0.6 : 0 }}
    />
  );
}

export default function Arrival() {
  const reduce = useReducedMotion();
  const [docked, setDocked] = useState(false);
  // Reduced motion skips the whole intro and renders the docked/settled state.
  const dockedNow = docked || !!reduce;

  useEffect(() => {
    if (reduce) return;
    // slam-in (~0.75s) + hold (0.4s) → dock
    const t = setTimeout(() => setDocked(true), 1300);
    return () => clearTimeout(t);
  }, [reduce]);

  const contentVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const eyebrowVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
  };
  // The h2 orchestrates its own word stagger; each word is a DIRECT motion child.
  const headlineContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_EXPO } },
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* ── Background reel (desktop only) — sits behind the wordmark + text ── */}
      <HeroVideo visible={dockedNow} />

      {/* ── Wordmark: slams in centered, then LAYOUT-animates into the logo slot ── */}
      <div className="pointer-events-none fixed inset-0 z-45">
        <motion.div
          layout
          transition={{ layout: { duration: 0.9, ease: EASE_EXPO } }}
          className={
            dockedNow
              ? "absolute left-4 top-0 flex h-16 items-center sm:left-6 lg:left-8"
              : "absolute inset-0 flex items-center justify-center"
          }
        >
          <Link
            href="/"
            aria-label="Podflix home"
            className={dockedNow ? "pointer-events-auto" : "pointer-events-none"}
          >
            <motion.span
              layout
              transition={{ layout: { duration: 0.9, ease: EASE_EXPO } }}
              className={`block font-display font-black leading-none tracking-tight text-cream ${
                dockedNow
                  ? "text-xl tracking-wider"
                  : "text-[clamp(3rem,17vw,12rem)]"
              }`}
            >
              {/* Once docked this is the site's masthead, so it becomes the
                  real logo — the per-letter animation only exists for the
                  intro, and the wordmark should never persist as text. */}
              {dockedNow ? (
                <Image
                  src={LOGO_SRC}
                  alt="Podflix"
                  width={100}
                  height={28}
                  priority
                  className="h-7 w-auto md:h-8"
                />
              ) : reduce
                ? "PODFLIX"
                : WORDMARK.map((letter, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ opacity: 0, y: -20, scale: 1.4 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.06,
                        delay: 0.2 + i * 0.08,
                        ease: "easeOut",
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* ── Hero content: fades/rises in once the wordmark has docked ──
           Left padding is held wider than the SCROLL cue's lane (left-3 /
           md:left-5 plus its ~16px glyph) so the headline never reaches it. */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col justify-center pr-6 pl-12 sm:pr-10 md:pl-20 lg:pr-16 lg:pl-24"
        variants={contentVariants}
        initial="hidden"
        animate={dockedNow ? "visible" : "hidden"}
      >
        <motion.p
          variants={eyebrowVariants}
          className="text-eyebrow mb-8 font-body text-gold"
        >
          {SERVICES_LINE} — Dubai
        </motion.p>

        {/* The page's single h1. The visible words animate in per-word; the
            leading sr-only span carries the primary keyword so the heading
            text crawlers read is "Podflix — Podcast Studio Dubai. Every Story
            Starts Here." while the design is unchanged. */}
        <motion.h1
          variants={headlineContainer}
          className="font-display text-[clamp(5rem,12vw,10rem)] font-black leading-[0.9] tracking-[-0.03em] text-cream"
        >
          <span className="sr-only">Podflix — Podcast Studio Dubai. </span>
          {HEADLINE.map((word) => (
            <motion.span key={word} variants={wordVariants} className="block">
              {word}
            </motion.span>
          ))}
        </motion.h1>
      </motion.div>

      {/* ── Corner CTA (bottom-right) ── */}
      <motion.div
        className="absolute bottom-44 right-6 z-10 sm:right-10 md:bottom-8 lg:right-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: dockedNow ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: dockedNow ? 0.5 : 0 }}
      >
        <Link
          href="/booking"
          className="group relative inline-flex items-center gap-2 font-body text-base font-medium text-gold sm:text-lg"
        >
          <span className="relative">
            Book a Session
            <DrawUnderline show={dockedNow} />
          </span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-2"
          >
            →
          </span>
        </Link>
      </motion.div>

      {/* ── Scroll cue (bottom-left, vertical) ── */}
      <motion.div
        className="absolute bottom-24 left-3 z-20 flex flex-col items-center gap-3 md:bottom-10 md:left-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: dockedNow ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: dockedNow ? 0.7 : 0 }}
      >
        <span
          className="text-[10px] tracking-[0.4em] text-text-muted"
          style={{ writingMode: "vertical-rl" }}
        >
          SCROLL
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-border">
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2 bg-gold"
            animate={reduce ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
      </motion.div>
    </section>
  );
}
