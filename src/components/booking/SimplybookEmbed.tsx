"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SB_BASE } from "@/lib/booking";

/** Chrome dots — purely decorative, so the frame reads as our own surface. */
const DOTS = ["bg-red-500/50", "bg-gold/50", "bg-green-500/50"];

/**
 * SimplyBook.me booking widget, deep-linked to a single service so the
 * customer lands on the calendar rather than SimplyBook's service list.
 *
 * `allow="payment"` is required — without it the Payment Request API is
 * blocked inside the iframe and Stripe checkout can fail to open.
 */
export default function SimplybookEmbed({ sbId }: { sbId: number }) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  const src = `${SB_BASE}/v2/?theme=hugo&widget-type=iframe#book/service/${sbId}/count/1/`;

  return (
    <div className="relative overflow-hidden border border-gold/20 bg-surface">
      {/* Top chrome */}
      <div className="flex items-center justify-between border-b border-gold/10 bg-surface px-4 py-3 md:px-6 md:py-4">
        <div aria-hidden className="flex gap-2">
          {DOTS.map((c) => (
            <span key={c} className={`block h-2.5 w-2.5 rounded-full ${c}`} />
          ))}
        </div>
        <span className="text-[9px] uppercase tracking-[0.4em] text-cream/20">
          Secure Booking
        </span>
      </div>

      {/* Widget */}
      <div className="relative">
        <iframe
          // Remounting on service change forces SimplyBook to re-read the hash;
          // it does not re-route on a fragment-only src update.
          key={sbId}
          src={src}
          title="Book your session"
          className="w-full min-h-225 border-0 md:min-h-190"
          loading="lazy"
          allow="payment"
          onLoad={() => setLoaded(true)}
        />

        {/* Loading ring — covers the widget's white flash while it boots. */}
        <AnimatePresence>
          {!loaded && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-surface"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gold/15"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-gold"
                  strokeDasharray="126"
                  animate={reduce ? undefined : { strokeDashoffset: [126, 32, 126] }}
                  transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
                />
              </motion.svg>
              <span className="sr-only">Loading availability…</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer strip */}
      <div className="border-t border-gold/10 px-4 py-3 md:px-6">
        <p className="text-xs tracking-widest text-cream/25">
          🔒 Payments secured by Stripe
        </p>
      </div>
    </div>
  );
}
