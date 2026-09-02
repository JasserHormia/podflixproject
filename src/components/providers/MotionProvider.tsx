"use client";

import { MotionConfig } from "framer-motion";
import { useIsTouch } from "@/lib/useIsTouch";

/**
 * Strips transform animation from every motion component on touch devices.
 *
 * `reducedMotion="always"` makes Framer skip transform and layout keyframes
 * while still running opacity — which is exactly the trade we want on a phone:
 * a fade is one compositor property, a y-slide forces layout work on every
 * frame of every section that scrolls into view.
 *
 * This is deliberately NOT the same switch as the OS reduced-motion setting.
 * useReducedMotion() reads the media query directly and is unaffected by this,
 * so components that branch on `reduce` for semantic reasons — HeroVideo
 * returning null, Arrival skipping its intro — behave exactly as before.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isTouch = useIsTouch();
  return (
    <MotionConfig reducedMotion={isTouch ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}
