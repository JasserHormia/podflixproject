"use client";

import { useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

const STEPS = [
  { n: "01", title: "Book.", line: "Reserve your slot in minutes." },
  { n: "02", title: "Record.", line: "Step in — the room is ready." },
  { n: "03", title: "Publish.", line: "We cut it. You go live." },
];

export default function TheProcess() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    progress.set(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section className="relative bg-background">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        // Native horizontal snap-scroll. overflow-y-hidden lets vertical
        // gestures pass through to the page (no scroll-trapping).
        className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-x pan-y" }}
      >
        {STEPS.map((step) => (
          <div
            key={step.n}
            className="grid min-h-screen w-screen shrink-0 snap-center grid-cols-1 items-center gap-6 px-6 sm:px-10 md:grid-cols-2 lg:px-16"
          >
            {/* Left half — the oversized index */}
            <span
              aria-hidden
              className="select-none font-display text-[40vw] font-black leading-none text-cream/5 md:text-[20vw]"
            >
              {step.n}
            </span>

            {/* Right half — the word + one line */}
            <div>
              <h3 className="font-display text-6xl font-black leading-none text-cream sm:text-7xl">
                {step.title}
              </h3>
              <p className="mt-6 max-w-xs font-body text-lg text-gold">
                {step.line}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar — fills left→right across the 3 steps */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-border">
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="h-full w-full origin-left bg-gold"
        />
      </div>
    </section>
  );
}
