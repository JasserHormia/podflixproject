"use client";

import SimplybookWidget from "@/components/booking/SimplybookWidget";
import { whatsappBookingHref, type BookingSummary } from "@/lib/booking";
import { SOCIAL } from "@/lib/brand";

/** Chrome dots — purely decorative, so the frame reads as our own surface. */
const DOTS = ["bg-red-500/50", "bg-gold/50", "bg-green-500/50"];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Inline SimplyBook.me booking widget, deep-linked to one service so the
 * customer lands on its calendar rather than SimplyBook's service list.
 */
export default function SimplybookEmbed({
  sbId,
  summary,
}: {
  sbId: number;
  summary: BookingSummary;
}) {
  return (
    <div>
      <h3 className="font-display text-3xl font-black text-cream">
        Pick your date and pay.
      </h3>
      <p className="mt-3 font-body text-cream/50">
        Live availability. Your session is confirmed the moment you pay.
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

        <SimplybookWidget sbId={sbId} />
      </div>

      <p className="mt-4 text-xs tracking-widest text-cream/25">
        🔒 Payments secured by Stripe
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
