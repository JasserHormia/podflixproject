"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { SB_BASE, whatsappBookingHref, type BookingSummary } from "@/lib/booking";
import { SOCIAL } from "@/lib/brand";

/** Chrome dots — purely decorative, so the inline frame reads as our surface. */
const DOTS = ["bg-red-500/50", "bg-gold/50", "bg-green-500/50"];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Booking handoff.
 *
 * The primary path opens SimplyBook in a new tab. Inside an iframe SimplyBook
 * relies on third-party cookies, which Chrome blocks by default — that breaks
 * the session mid-payment, so the embed cannot be the default route.
 *
 * The iframe is kept behind a toggle for browsers that still allow it, since
 * staying on-page is nicer when it works.
 */
export default function SimplybookEmbed({
  sbId,
  summary,
}: {
  sbId: number;
  summary: BookingSummary;
}) {
  const reduce = useReducedMotion();
  const [inline, setInline] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // No widget-type=iframe on the new-tab URL — that param is for embedding.
  const sbUrl = `${SB_BASE}/v2/#book/service/${sbId}/count/1/`;
  const iframeSrc = `${SB_BASE}/v2/?theme=hugo&widget-type=iframe#book/service/${sbId}/count/1/`;

  return (
    <div className="border border-gold/20 bg-surface p-8 text-center sm:p-10 md:p-14">
      <p className="text-[10px] uppercase tracking-[0.4em] text-gold/50">
        Secure Checkout
      </p>

      <h3 className="mt-4 font-display text-3xl font-black text-cream md:text-4xl">
        Pick your date and pay.
      </h3>

      <p className="mx-auto mt-4 max-w-md font-body text-cream/50">
        You&apos;ll choose your slot and complete payment on our secure booking
        system. Takes about a minute.
      </p>

      {/* Primary — new tab. items-stretch lets it fill the card on phones. */}
      <div className="mt-8 flex flex-col items-stretch sm:items-center">
        <MagneticButton
          onClick={() => window.open(sbUrl, "_blank", "noopener")}
          className={`mx-auto block w-full max-w-sm rounded-none bg-gold px-12 py-6 text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors duration-300 hover:bg-cream sm:w-auto ${FOCUS}`}
        >
          Open Secure Booking →
        </MagneticButton>
      </div>

      <p className="mt-5 text-xs tracking-widest text-cream/25">
        🔒 Payments secured by Stripe · Opens in a new tab
      </p>

      {/* Secondary — inline, for browsers that permit the cookies. */}
      <button
        type="button"
        onClick={() => setInline((v) => !v)}
        aria-expanded={inline}
        aria-controls="inline-booking"
        className={`mt-6 inline-flex items-center gap-1 text-xs text-cream/30 transition-colors hover:text-cream/60 ${FOCUS}`}
      >
        {inline ? "Hide inline booking" : "Or book inline"}
        <span
          aria-hidden
          className={`inline-block transition-transform duration-300 ${
            inline ? "rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>

      <AnimatePresence initial={false}>
        {inline && (
          <motion.div
            id="inline-booking"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 pt-6 text-xs text-cream/40">
              If the booking form asks to allow cookies, tap Allow — or use the
              button above instead.
            </p>

            <div className="overflow-hidden border border-gold/20 bg-surface text-left">
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
                  className="min-h-225 w-full border-0 md:min-h-190"
                  // Not lazy: the iframe only mounts once the disclosure opens,
                  // so lazy buys nothing and delays it reserving its min-height
                  // — which made the expand snap instead of glide.
                  allow="payment"
                  onLoad={() => setLoaded(true)}
                />

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

              <div className="border-t border-gold/10 px-4 py-3 md:px-6">
                <p className="text-xs tracking-widest text-cream/25">
                  🔒 Payments secured by Stripe
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <hr className="my-10 border-cream/10" />

      {/* None of these cross into SimplyBook's intake form automatically. */}
      <div className="border border-gold/30 bg-gold/10 p-5 text-left">
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
