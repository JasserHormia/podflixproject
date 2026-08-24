"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SB_BASE, whatsappBookingHref, type BookingSummary } from "@/lib/booking";
import { SOCIAL } from "@/lib/brand";

/** Chrome dots — purely decorative, so the frame reads as our own surface. */
const DOTS = ["bg-red-500/50", "bg-gold/50", "bg-green-500/50"];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Inline SimplyBook.me booking widget, deep-linked to one service so the
 * customer lands on its calendar rather than SimplyBook's service list.
 *
 * `allow="payment"` is required — without it the Payment Request API is
 * blocked inside the iframe and Stripe checkout can fail to open.
 *
 * SimplyBook holds its session in third-party cookies, which some browsers
 * block inside an iframe. The "Open in a new tab" link below the frame is the
 * escape hatch for anyone whose widget cannot complete checkout here.
 */
export default function SimplybookEmbed({
  sbId,
  summary,
}: {
  sbId: number;
  summary: BookingSummary;
}) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  const iframeSrc = `${SB_BASE}/v2/?theme=hugo&widget-type=iframe#book/service/${sbId}/count/1/`;
  // No widget-type param — that one is for embedding.
  const newTabUrl = `${SB_BASE}/v2/#book/service/${sbId}/count/1/`;

  return (
    <div>
      <h3 className="font-display text-3xl font-black text-cream">
        Pick your date and pay.
      </h3>
      <p className="mt-3 font-body text-cream/50">
        Live availability. Your slot is confirmed the moment you pay.
      </p>

      {/* Above the widget deliberately: none of these cross into SimplyBook's
          intake form automatically, so they need reading first. */}
      <div className="mt-8 border border-gold/30 bg-gold/10 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
          When the form asks, enter:
        </p>
        <dl className="mt-4 space-y-2">
          <div className="flex items-baseline gap-3">
            <dt className="text-sm text-cream/40">Format</dt>
            <dd className="font-display text-lg text-cream">{summary.format}</dd>
          </div>
          <div className="flex items-baseline gap-3">
            <dt className="text-sm text-cream/40">Set</dt>
            <dd className="font-display text-lg text-cream">{summary.set}</dd>
          </div>
          {summary.addons.length > 0 && (
            <div className="flex items-baseline gap-3">
              <dt className="text-sm text-cream/40">Add-ons</dt>
              <dd className="font-display text-lg text-cream">
                {summary.addons.map((a) => a.name).join(", ")}
              </dd>
            </div>
          )}
        </dl>
        {summary.addons.length > 0 && (
          <p className="mt-3 text-xs text-cream/40">
            Add-ons are selected inside the booking form.
          </p>
        )}
      </div>

      {/* ── Framed widget ── */}
      <div className="mt-6 overflow-hidden border border-gold/20 bg-surface">
        <div className="flex items-center justify-between border-b border-gold/10 px-4 py-3 md:px-6 md:py-4">
          <div aria-hidden className="flex gap-2">
            {DOTS.map((c) => (
              <span key={c} className={`block h-2.5 w-2.5 rounded-full ${c}`} />
            ))}
          </div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-cream/20">
            Secure Booking
          </span>
        </div>

        <div className="relative">
          <iframe
            // SimplyBook routes on the hash, and browsers do not reload an
            // iframe on a fragment-only change — so remount per service.
            key={sbId}
            src={iframeSrc}
            title="Book your session"
            className="min-h-245 w-full border-0 md:min-h-205"
            loading="eager"
            allow="payment"
            onLoad={() => setLoaded(true)}
          />

          {/* Covers the widget's white flash while it boots. */}
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
      </div>

      <p className="mt-4 text-xs tracking-widest text-cream/25">
        🔒 Payments secured by Stripe
      </p>

      {/* Escape hatch for browsers that block SimplyBook's cookies in-frame. */}
      <p className="mt-3">
        <a
          href={newTabUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center gap-1 text-xs text-cream/30 transition-colors hover:text-cream/60 ${FOCUS}`}
        >
          Trouble loading? Open in a new tab
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </p>

      <p className="mt-6 text-sm">
        <a
          href={whatsappBookingHref(summary, SOCIAL.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center gap-1.5 text-gold ${FOCUS}`}
        >
          Prefer to book by message? Chat on WhatsApp
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </p>
    </div>
  );
}
