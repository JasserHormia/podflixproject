"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { VIDEOS } from "@/lib/images";

// Exact overlay per spec — keeps the wordmark/text legible over footage.
const OVERLAY =
  "linear-gradient(to bottom, rgba(10,8,7,0.55) 0%, rgba(10,8,7,0.3) 50%, rgba(10,8,7,0.98) 100%)";

/**
 * Which reel to mount, or `null` before we know (server + first paint).
 *
 * Deliberately *not* two CSS-toggled <video> tags: `display:none` does not stop
 * a video from loading, so that approach makes phones pull both reels (22MB).
 * Rendering exactly one element guarantees exactly one download.
 */
function useReel(): "desktop" | "mobile" | null {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => (window.matchMedia("(min-width: 768px)").matches ? "desktop" : "mobile"),
    () => null
  );
}

/**
 * Hero background reel — sits behind the wordmark + text (z-0).
 * Desktop (md+) plays the landscape cut, mobile plays the vertical cut.
 * Fades in via `visible` (wired to fire after the PODFLIX letters land), so the
 * one-tick wait for the breakpoint is never visible.
 *
 * Reduced motion: no reel at all — the hero keeps its flat dark background.
 */
export default function HeroVideo({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion();
  const reel = useReel();

  if (reduce || reel === null) return null;

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
        src={reel === "desktop" ? VIDEOS.hero_desktop : VIDEOS.hero_mobile}
        // muted + playsInline are required for autoplay to be allowed.
        autoPlay
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
