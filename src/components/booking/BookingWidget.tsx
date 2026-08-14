"use client";

import { motion, useReducedMotion } from "framer-motion";

const INCLUSIONS = [
  "🎙 Pro Microphones",
  "🎬 Cinema Camera",
  "💡 Studio Lighting",
  "📡 Streaming Ready",
];

/** Self-drawing gold ring loader (SVG circle, looping). */
function RingLoader({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      className="text-gold"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
    >
      <motion.circle
        cx="28"
        cy="28"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0.05 }}
        animate={reduce ? { pathLength: 0.75 } : { pathLength: [0.05, 0.75, 0.05] }}
        transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
      />
    </motion.svg>
  );
}

export default function BookingWidget() {
  const reduce = useReducedMotion();

  return (
    <section id="book" className="scroll-mt-24 bg-background px-8 py-24">
      {/* Seamless dark theming for the future Simplybook.me iframe. */}
      <style>{`
        .booking-widget-container iframe {
          width: 100%;
          min-height: 500px;
          border: none;
          background: transparent;
        }
      `}</style>

      <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-16 md:grid-cols-[2fr_3fr]">
        {/* LEFT — sticky context */}
        <div className="md:sticky md:top-28">
          <p className="mb-8 text-xs uppercase tracking-[0.2em] text-cream/40">
            What you&apos;re booking:
          </p>
          <h2 className="font-display text-3xl font-black text-cream">Podflix Studio</h2>
          <p className="mt-2 text-sm text-cream/60">📍 Tamani Arts Building, Business Bay, Dubai</p>
          <p className="mt-1 text-sm text-cream/40">9th Floor, Studio 902</p>

          <div className="my-6 border-b border-cream/10" />

          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/40">
            What&apos;s included:
          </p>
          <ul>
            {INCLUSIONS.map((item) => (
              <li key={item} className="border-b border-cream/5 py-2 text-sm text-cream/70">
                {item}
              </li>
            ))}
          </ul>

          <div className="my-6 border-b border-cream/10" />

          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cream/40">Need help?</p>
          <a
            href="https://wa.me/971565343070"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-block text-sm text-gold"
          >
            Chat with us →
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100"
            />
          </a>
        </div>

        {/* RIGHT — the widget window */}
        <div className="overflow-hidden rounded-none border border-gold/20 bg-surface">
          {/* macOS-style title bar — signals an interactive app */}
          <div className="flex items-center justify-between border-b border-gold/10 px-8 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-gold/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-cream/20">
              Booking System
            </span>
          </div>

          {/* Widget content area */}
          <div className="booking-widget-container relative min-h-[500px]">
            {/*
              TODO: Replace this placeholder with the Simplybook.me embed script
              when the account is configured. Widget embed code goes here:
              <div id="sbw_XXXXX"></div>
              <script src="//widget.simplybook.me/v2/widget/widget.js"></script>
            */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <RingLoader reduce={reduce} />
              <p className="text-sm tracking-[0.2em] text-cream/30">
                Booking system loading...
              </p>
              <p className="text-xs text-cream/20">Powered by Simplybook.me</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
