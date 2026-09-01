import { PROMO_ACTIVE, PROMO_LABEL } from "@/lib/promo";

/**
 * Launch-offer banner. Renders nothing at all when the promotion is off, so
 * every placement disappears on the same flag flip that restores the prices —
 * no orphaned "30% off" strip left advertising a discount that has ended.
 */
export default function PromoBadge({ className = "" }: { className?: string }) {
  if (!PROMO_ACTIVE) return null;

  return (
    <p
      className={`inline-flex items-center border border-gold/40 bg-gold/10 px-4 py-2 font-display text-[11px] uppercase tracking-[0.25em] text-gold ${className}`}
    >
      {PROMO_LABEL}
    </p>
  );
}
