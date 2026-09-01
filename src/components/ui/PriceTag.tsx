import { formatPrice } from "@/lib/booking";
import { PROMO_ACTIVE, promoPrice } from "@/lib/promo";

/**
 * A price, with the pre-promotion figure struck through beside it.
 *
 * Takes the ORIGINAL price and applies the discount itself, so no call site
 * can render a discounted number without the struck original next to it, and
 * none of them has to branch on PROMO_ACTIVE. When the promotion ends this
 * silently becomes a plain price — no call site changes.
 *
 * Accessibility: the struck figure is aria-hidden, so a screen reader
 * announces only the price actually payable. Sighted users get the comparison;
 * assistive tech gets one unambiguous number rather than "590 413".
 */
export default function PriceTag({
  original,
  current,
  className = "",
  strikeClassName = "",
  suffix = "",
  stacked = false,
}: {
  /** Undiscounted price. The discount is applied here, not by the caller. */
  original: number;
  /**
   * Overrides the discounted figure. Only for per-hour rates, where the rate
   * is the discounted total divided by hours rather than a discounted rate.
   */
  current?: number;
  /** Classes for the live price. */
  className?: string;
  /** Classes for the struck original. */
  strikeClassName?: string;
  /** Appended to the live price only, e.g. "/hour". */
  suffix?: string;
  /** Struck figure above the live price instead of inline before it. */
  stacked?: boolean;
}) {
  const now = current ?? promoPrice(original);

  if (!PROMO_ACTIVE) {
    return (
      <span className={className}>
        {formatPrice(original)}
        {suffix}
      </span>
    );
  }

  return (
    <span className={stacked ? "block" : "inline-flex items-baseline gap-2"}>
      <span
        aria-hidden
        className={`${stacked ? "block" : ""} line-through decoration-1 ${strikeClassName}`}
      >
        {formatPrice(original)}
        {suffix}
      </span>
      <span className={`${stacked ? "block" : ""} ${className}`}>
        {formatPrice(now)}
        {suffix}
      </span>
    </span>
  );
}
