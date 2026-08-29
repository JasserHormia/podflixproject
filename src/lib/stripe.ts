import Stripe from "stripe";

/** Server-only Stripe client. Read at call time so a missing key fails loudly. */
export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

/** Cal and Stripe both work in minor units; AED has 100 fils. */
export const toFils = (aed: number) => Math.round(aed * 100);

/** Statuses where an intent is still usable for a fresh checkout attempt. */
const REUSABLE = new Set([
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
  "processing",
]);

/**
 * Finds an existing PaymentIntent for a Cal booking.
 *
 * Cal deduplicates bookings by attendee email, so a customer who submits twice
 * gets the same bookingUid back — but without this, each attempt minted a new
 * intent, leaving orphans on the account. Searching first means one booking
 * keeps one intent.
 *
 * Search is tried first but its index lags by up to a minute, and a miss here
 * would recreate the very orphan we are avoiding, so a miss falls back to
 * listing recent intents, which is strongly consistent.
 */
export async function findIntentForBooking(uid: string) {
  const stripe = stripeClient();
  const safe = uid.replace(/[^A-Za-z0-9_-]/g, "");
  try {
    const found = await stripe.paymentIntents.search({
      query: `metadata['calBookingUid']:'${safe}'`,
      limit: 10,
    });
    const hit = found.data.find((p) => REUSABLE.has(p.status) || p.status === "succeeded");
    if (hit) return hit;
  } catch (err) {
    console.warn("[stripe] intent search failed, falling back to list", err);
  }
  try {
    const recent = await stripe.paymentIntents.list({ limit: 100 });
    return (
      recent.data.find(
        (p) =>
          p.metadata?.calBookingUid === uid &&
          (REUSABLE.has(p.status) || p.status === "succeeded")
      ) ?? null
    );
  } catch (err) {
    console.error("[stripe] intent list failed", err);
    return null;
  }
}

export const isReusableIntent = (status: string) => REUSABLE.has(status);
