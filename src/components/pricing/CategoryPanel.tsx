"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { durationLabel, formatPrice, hourlyRate, type Session } from "@/lib/booking";

/** The three panels differ only by palette; everything else is shared. */
type Tone = "surface" | "gold" | "teal";

const TONES: Record<
  Tone,
  {
    section: string;
    eyebrow: string;
    heading: string;
    body: string;
    price: string;
    rule: string;
    item: string;
    watermark: string;
    badge: string;
    accent: string;
    revisions: string;
    scrim: string;
  }
> = {
  surface: {
    section: "bg-surface",
    eyebrow: "text-gold/60",
    heading: "text-cream",
    body: "text-cream/60",
    price: "text-gold",
    rule: "border-cream/10",
    item: "text-cream/60",
    watermark: "text-cream/5",
    badge: "bg-gold text-background",
    accent: "text-gold",
    revisions: "text-gold",
    scrim: "rgba(17,16,9,0.8)",
  },
  gold: {
    section: "bg-gold",
    eyebrow: "text-background/80",
    heading: "text-background",
    body: "text-background/80",
    price: "text-background",
    rule: "border-background/20",
    item: "text-background/80",
    watermark: "text-background/10",
    badge: "bg-background text-cream",
    accent: "text-background",
    revisions: "text-background/80",
    scrim: "rgba(169,143,116,0.7)",
  },
  teal: {
    section: "bg-teal",
    eyebrow: "text-gold/60",
    heading: "text-cream",
    body: "text-cream/60",
    price: "text-gold",
    rule: "border-cream/10",
    item: "text-cream/60",
    watermark: "text-cream/5",
    badge: "bg-gold text-background",
    accent: "text-gold",
    // Gold tops out at 4.27:1 on teal even at full opacity, so this one
    // line drops to cream rather than sit under AA.
    revisions: "text-cream/70",
    scrim: "rgba(35,51,59,0.8)",
  },
};

export default function CategoryPanel({
  index,
  eyebrow,
  title,
  subtitle,
  sessions,
  image,
  alt,
  tone,
  imageSide = "right",
}: {
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  sessions: Session[];
  image: string;
  alt: string;
  tone: Tone;
  imageSide?: "left" | "right";
}) {
  const reduce = useReducedMotion();
  const t = TONES[tone];
  const imageLeft = imageSide === "left";

  return (
    // overflow-hidden clips the ±60px entry offset so the page never scrolls
    // sideways before the panel animates in.
    <section
      className={`grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-2 ${t.section}`}
    >
      {/* ── CONTENT ── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: imageLeft ? 60 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className={`relative flex flex-col justify-center px-8 py-20 md:px-16 ${
          t.section
        } ${imageLeft ? "md:order-2" : "md:order-1"}`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute top-8 -z-10 max-w-full select-none overflow-hidden font-display text-[80px] font-black leading-none md:text-[160px] ${
            t.watermark
          } ${imageLeft ? "right-8" : "left-8"}`}
        >
          {index}
        </span>

        <div className="relative">
          <p className={`mb-4 text-[9px] uppercase tracking-[0.4em] ${t.eyebrow}`}>
            {eyebrow}
          </p>
          <h3
            className={`font-display font-black leading-[0.85] ${t.heading}`}
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            {title}
          </h3>
          <p className={`mt-3 max-w-sm font-body text-lg ${t.body}`}>{subtitle}</p>

          <div className="mt-10 max-w-lg">
            {sessions.map((s) => (
              <div key={s.id} className={`border-b py-6 ${t.rule}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-display text-xl font-semibold ${t.heading}`}
                      >
                        {s.name}
                      </span>
                      {s.recommended && (
                        <span
                          className={`px-2 py-0.5 text-[8px] uppercase tracking-widest ${t.badge}`}
                        >
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className={`mt-1 font-body text-sm ${t.body}`}>{s.tagline}</p>
                    <span
                      className={`mt-2 inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest ${t.rule} ${t.body}`}
                    >
                      {durationLabel(s.hours)}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`block font-display text-2xl font-black ${t.price}`}
                    >
                      {formatPrice(s.price)}
                    </span>
                    {s.hours > 1 && (
                      <span className={`mt-1 block text-xs ${t.body}`}>
                        {formatPrice(hourlyRate(s))}/hour
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                  {s.includes.map((inc) => (
                    <li
                      key={inc}
                      className={`flex items-start gap-2 font-body text-sm ${t.item}`}
                    >
                      <span aria-hidden className={t.accent}>
                        ✓
                      </span>
                      {inc}
                    </li>
                  ))}
                </ul>

                {s.revisions && (
                  <p
                    className={`mt-3 text-[10px] uppercase tracking-[0.25em] ${t.revisions}`}
                  >
                    {s.revisions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── IMAGE ── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: imageLeft ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className={`relative min-h-[45vh] md:min-h-full ${
          imageLeft ? "md:order-1" : "md:order-2"
        }`}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={85}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to ${imageLeft ? "left" : "right"}, ${
              t.scrim
            } 0%, transparent 55%)`,
          }}
        />
      </motion.div>
    </section>
  );
}
