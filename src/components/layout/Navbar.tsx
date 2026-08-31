"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type Variants,
} from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { LOGO_SRC, NAV_LINKS, SERVICES_LINE } from "@/lib/brand";

/** Pulsing red REC dot. */
function RecDot({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.span
      aria-hidden
      className="block h-2 w-2 rounded-full bg-red-500"
      animate={reduce ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

function LogoImage() {
  return (
    <Image
      src={LOGO_SRC}
      alt="Podflix"
      width={140}
      height={40}
      priority
      className="h-9 w-auto object-contain"
      style={{ minWidth: "140px" }}
    />
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const pathname = usePathname();
  // Homepage supplies its own docked wordmark (Arrival) in the logo slot.
  const isHome = pathname === "/";

  /**
   * Close the menu whenever the route changes.
   *
   * The link handlers already call setOpen(false), but this component lives in
   * the root layout and never unmounts, so any navigation that bypasses those
   * handlers — browser back/forward being the obvious one — used to leave
   * `open` true. The scroll lock below is keyed on `open`, so it stayed
   * engaged on the new page and scrolling was dead until the menu was opened
   * and closed again.
   *
   * Adjusting state during render rather than in an effect: React re-renders
   * immediately without committing the stale UI, and it keeps the lock and the
   * menu from ever disagreeing for a frame.
   */
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    if (open) setOpen(false);
  }

  // Body scroll lock — engaged while the menu is open, restored on close /
  // unmount, and now also on any route change via the reset above.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes the menu. Listener exists only while open; cleanup removes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Mobile pill "breathing": compresses with scroll velocity, springs back to 1.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const pillScaleTarget = useTransform(velocity, [-1500, 0, 1500], [0.95, 1, 0.95]);
  const pillScaleX = useSpring(pillScaleTarget, { stiffness: 400, damping: 30 });

  const listContainer: Variants = {
    hidden: {},
    visible: {
      transition: reduce ? { duration: 0 } : { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EXPO } },
  };

  return (
    <>
      {/* ── DEFAULT NAVBAR — transparent, always ── */}
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {isHome ? (
            <span aria-hidden />
          ) : (
            <Link href="/" aria-label="Podflix home" className="flex min-h-11 min-w-35 items-center">
              <LogoImage />
            </Link>
          )}

          {/* Right side — desktop only */}
          <div className="hidden items-center gap-6 md:flex">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="group flex items-center gap-2"
            >
              <RecDot reduce={reduce} />
              <span className="font-display text-[11px] uppercase tracking-[0.3em] text-cream/60 transition-colors duration-300 group-hover:text-cream md:text-[10px]">
                REC
              </span>
            </button>

            <Link
              href="/booking"
              className="group relative font-display text-[10px] uppercase tracking-[0.3em] text-gold"
            >
              BOOK
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          </div>
        </nav>
      </header>

      {/* ── MOBILE — the floating vault pill ── */}
      <motion.div
        className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_EXPO, delay: 1 }}
      >
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={reduce ? undefined : { scaleX: pillScaleX }}
          className="flex items-center gap-4 rounded-full border border-gold/20 bg-surface/90 px-6 py-3 shadow-[0_0_20px_rgba(169,143,116,0.15)] backdrop-blur-md"
        >
          <span className="flex items-center gap-1.5">
            <RecDot reduce={reduce} />
            <span className="text-[11px] uppercase tracking-[0.3em] text-cream/60 md:text-[10px]">REC</span>
          </span>
          <Image
            src={LOGO_SRC}
            alt="Podflix"
            width={100}
            height={28}
            // The mobile pill is on screen from first paint on every page, so
            // the brand mark must not wait for a lazy-load pass. Not `priority`
            // (deprecated in Next 16), and not `preload` either — that injects a
            // <link> into <head> on every route, including desktop, where this
            // pill is md:hidden and the image never renders at all.
            loading="eager"
            className="h-7 w-auto object-contain"
          />
          <span className="text-xs uppercase tracking-[0.2em] text-gold">MENU</span>
        </motion.button>
      </motion.div>

      {/* ── FULL-SCREEN MENU ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-70 bg-background/95 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }}
            exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
          >
            {/* Top-left logo */}
            <div className="absolute left-0 top-0 flex h-16 items-center px-4 sm:px-6 lg:px-8">
              <Link href="/" onClick={() => setOpen(false)} aria-label="Podflix home">
                <LogoImage />
              </Link>
            </div>

            {/* Top-right ESC */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-0 top-0 flex h-16 items-center px-4 text-xs uppercase tracking-[0.25em] text-cream/40 transition-colors hover:text-cream sm:px-6 lg:px-8"
            >
              ESC
            </button>

            {/* Center — nav links */}
            <motion.nav
              className="flex min-h-full flex-col items-center justify-center gap-3"
              variants={listContainer}
              initial="hidden"
              animate="visible"
            >
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                const dimmed = hovered !== null && hovered !== i;
                const highlighted = hovered === i || (hovered === null && isActive);
                const color = dimmed
                  ? "text-cream/20"
                  : highlighted
                    ? "text-gold"
                    : "text-cream";
                return (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(i)}
                      onBlur={() => setHovered(null)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex items-center justify-center font-display font-black leading-none tracking-tight transition-colors duration-300 ${color}`}
                      style={{ fontSize: "clamp(40px, 8vw, 96px)" }}
                    >
                      <span className="absolute right-full mr-6 hidden font-display text-sm text-gold/30 sm:block">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                      <motion.span
                        aria-hidden
                        className="absolute left-full ml-6 hidden text-gold sm:block"
                        initial={false}
                        animate={{ opacity: highlighted ? 1 : 0, x: highlighted ? 0 : -10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        →
                      </motion.span>
                      <motion.span
                        aria-hidden
                        className="absolute -bottom-1 left-0 h-px w-full origin-left bg-gold"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hovered === i ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Bottom row */}
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-between px-6 text-xs sm:px-10">
              <span className="tracking-[0.2em] text-cream/20">
                {SERVICES_LINE} — Dubai
              </span>
              <div className="flex gap-4 text-cream/30">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  IG
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  TW
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
