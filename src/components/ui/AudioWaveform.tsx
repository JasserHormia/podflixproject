"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIsTouch } from "@/lib/useIsTouch";

/**
 * Deterministic pseudo-random in [0, 1), seeded by bar index. Pure (Math.sin/
 * floor only) → identical on server and client, so the bars never cause a
 * hydration mismatch and never call an impure function during render.
 */
function noise(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * A living audio-waveform: a row of vertical bars whose heights breathe on
 * loop (each at its own duration), mirrored for organic motion. Positioning is
 * left to the parent via `className`. Static under reduced-motion.
 */
export default function AudioWaveform({
  count = 40,
  barClassName = "bg-gold/40",
  className = "",
  minHeight = 4,
  maxHeight = 60,
}: {
  count?: number;
  barClassName?: string;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
}) {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();

  const bars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        duration: 0.4 + noise(i, 1) * 0.8, // 0.4s–1.2s
        peak: minHeight + noise(i, 2) * (maxHeight - minHeight),
        delay: noise(i, 3) * 0.6,
      })),
    [count, minHeight, maxHeight]
  );

  return (
    <div aria-hidden className={`flex items-center justify-center gap-1.5 ${className}`}>
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className={`w-0.5 rounded-full ${barClassName}`}
          style={{ height: minHeight }}
          animate={reduce || isTouch ? undefined : { height: [minHeight, bar.peak, minHeight] }}
          transition={{
            duration: bar.duration,
            delay: bar.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
