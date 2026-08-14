"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { HERO_VIDEO } from "@/lib/images";

// Exact overlay per spec — keeps the wordmark/text legible over footage.
const OVERLAY =
  "linear-gradient(to bottom, rgba(10,8,7,0.55) 0%, rgba(10,8,7,0.3) 50%, rgba(10,8,7,0.98) 100%)";

/** SSR-safe desktop check (>= md). Server snapshot is false, so mobile never
 *  mounts the <video> and never downloads the reel. */
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

/**
 * Hero background reel — sits behind the wordmark + text (z-0), desktop only.
 * Fades in via `visible` (wired to fire after the PODFLIX letters land).
 */
export default function HeroVideo({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  // Mobile keeps the current stark black background (no video download).
  if (!isDesktop) return null;

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.2, ease: EASE_EXPO }}
    >
      <video
        className="h-full w-full object-cover"
        src={HERO_VIDEO}
        // Autoplay only when motion is welcome; muted + playsInline are required
        // for autoplay to be allowed by browsers.
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* Dark gradient overlay for legibility */}
      <div className="absolute inset-0" style={{ background: OVERLAY }} />
    </motion.div>
  );
}
