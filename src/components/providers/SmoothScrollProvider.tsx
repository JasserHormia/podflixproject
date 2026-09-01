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

    /**
     * Desktop only.
     *
     * Lenis leaves touch scrolling entirely native — `syncTouch` defaults to
     * false, and its gesture handler returns before `preventDefault()` for any
     * touch input. You can see it in the DOM: <html> carries `lenis` but never
     * `lenis-smooth` on a phone, because `lenis-smooth` is only added while
     * isScrolling === "smooth", and on touch it is "native".
     *
     * So on a touch device it delivers no smoothing at all, while still
     * attaching non-passive touchstart/touchmove listeners to window and
     * shipping a stylesheet whose `.lenis-stopped { overflow: hidden }` rule
     * would kill scrolling outright if anything ever stopped it. That is a
     * failure surface bought for nothing. Not running it on touch removes the
     * whole class of risk with no visual loss.
     *
     * Both conditions, not just `hover: none`. A device can report no hover
     * while still being pointer-driven (a TV remote, some kiosk browsers);
     * requiring a coarse pointer as well means this only ever catches genuine
     * touch input and never quietly disables smooth scrolling on a desktop.
     */
    const isTouch = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    if (prefersReducedMotion || isTouch) return;

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

    /**
     * Failsafe: scroll can never stay locked.
     *
     * Lenis applies `.lenis-stopped { overflow: hidden }`, so anything that
     * stops it and fails to start it again leaves the page unscrollable. No
     * code here calls stop() today — this is a guard against a future caller,
     * or an interrupt that skips its own cleanup, doing so silently. Calling
     * start() on an already-running instance is a no-op.
     */
    const failsafe = setTimeout(() => {
      if (lenis.isStopped) {
        console.warn("[scroll] Lenis was left stopped — force-starting");
      }
      lenis.start();
    }, 2500);

    return () => {
      clearTimeout(failsafe);
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
  const firstRun = useRef(true);
  useEffect(() => {
    // Skip the initial mount. This effect cannot tell a first page load from a
    // route change, and on a first load there is nothing to correct: the
    // browser has already put the page where it belongs. Resetting anyway
    // threw away whatever the visitor had scrolled to while the page was still
    // hydrating — on a slow connection that is several seconds of reading,
    // yanked back to the top the moment Lenis came alive. It also destroyed
    // native scroll restoration on reload.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
