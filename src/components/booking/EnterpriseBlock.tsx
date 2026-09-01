import MagneticButton from "@/components/ui/MagneticButton";
import { SOCIAL } from "@/lib/brand";
import { ENTERPRISE_HOURLY_RATE, formatPrice } from "@/lib/booking";
import { promoPrice } from "@/lib/promo";

const MESSAGE =
  "Hi! I'm interested in a full-day studio booking (8+ hours). Here's what I'm planning:";

const HREF = `${SOCIAL.whatsapp}?text=${encodeURIComponent(MESSAGE)}`;

/**
 * Lead capture for 8h+ bookings, which are quoted by the sales team rather
 * than sold through the flow. Deliberately inert: it holds no state, touches
 * no total, and cannot satisfy the Continue button — it is a link, nothing
 * more. Shared by booking step 3 and the pricing page so the two cannot drift.
 */
export default function EnterpriseBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col justify-between gap-6 border border-gold/25 bg-surface p-8 md:flex-row md:items-center ${className}`}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/50">
          Full Day &amp; Multi-Day
        </p>
        <h3 className="mt-2 font-display text-2xl font-black text-cream">
          Booking 8 hours or more?
        </h3>
        <p className="mt-2 max-w-md font-body text-sm text-cream/50">
          Full-day rates start at {formatPrice(promoPrice(ENTERPRISE_HOURLY_RATE))}{" "}
          per hour. Tell us what you&apos;re shooting and we&apos;ll build the
          session around it.
        </p>
      </div>

      <MagneticButton
        href={HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-none border border-gold bg-transparent px-8 py-4 text-center font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-colors duration-300 hover:bg-gold hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Talk to us →
      </MagneticButton>
    </div>
  );
}
