/**
 * Launch promotion — the single flag the whole site reads.
 *
 * Deliberately its own module rather than a copy in cal.ts and booking.ts.
 * The point of the design is that ending the promotion is one edit; two
 * declarations that must agree is exactly the failure this avoids, and it is
 * the same trap the AED 5 payment test fell into, where the displayed price
 * and the charged price lived in separate files and drifted.
 *
 * cal.ts and booking.ts both re-export these, so either import path works and
 * both resolve to this one definition.
 *
 * TO END THE PROMOTION: set PROMO_ACTIVE to false. Nothing else changes.
 * Original prices are never overwritten anywhere — SESSIONS, CAL_SESSIONS and
 * ADDONS still hold the real figures, and promoPrice() becomes the identity
 * function, so every price, per-hour rate, struck-through label, badge and
 * server-side charge reverts together in one commit.
 */

/** Master switch. false ⇒ every price on the site is the original again. */
export const PROMO_ACTIVE = true;

/** Discount applied while PROMO_ACTIVE. */
export const PROMO_PERCENT = 30;

/**
 * The price actually shown and actually charged.
 *
 * Rounds to a whole dirham. Math.round is half-up, which is what the agreed
 * figures assume: 3499 → 2449.3 → 2449, and a per-hour 1224.5 → 1225.
 *
 * Returns the input untouched when the promotion is off, so call sites never
 * branch on PROMO_ACTIVE just to get a number.
 */
export const promoPrice = (original: number) =>
  PROMO_ACTIVE ? Math.round(original * (1 - PROMO_PERCENT / 100)) : original;

/** Banner and badge copy, so the percentage is never typed twice. */
export const PROMO_LABEL = `Launch Offer — ${PROMO_PERCENT}% off all sessions`;
