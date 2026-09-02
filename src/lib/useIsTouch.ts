"use client";

import { useSyncExternalStore } from "react";

/**
 * The one touch test used across the site.
 *
 * Matches SmoothScrollProvider exactly: both conditions, so it only ever
 * catches genuine touch input and never a hover-less but pointer-driven
 * device (a TV remote, a kiosk browser).
 */
export const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

/**
 * True on touch devices. SSR-safe.
 *
 * The server snapshot is `false`, so the markup React hydrates is the desktop
 * one and there is no mismatch; useSyncExternalStore then re-renders with the
 * real value before paint. Every caller must therefore treat `false` as "not
 * known to be touch yet" rather than "definitely desktop" — which is the safe
 * direction, since the touch branch only ever removes work.
 *
 * Used to strip scroll-coupled and continuous animation off phones, where the
 * compositing cost is real and the effects are largely invisible anyway.
 */
export function useIsTouch() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(TOUCH_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(TOUCH_QUERY).matches,
    () => false
  );
}
