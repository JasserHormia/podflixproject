"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Wraps the app in Lenis-powered smooth scrolling.
 * Disables itself when the user prefers reduced motion.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /**
   * Start every route at the top.
   *
   * The App Router navigates on the client and does reset window scroll, but
   * Lenis keeps its own `animatedScroll` position and writes it back on the
   * next frame — so the page springs straight back down to wherever the
   * previous route was. Resetting Lenis itself is what actually sticks.
   *
   * `window.scrollTo` first covers the cases where there is no Lenis instance
   * to reset: reduced-motion users, and the first paint before the effect
   * above has run.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
