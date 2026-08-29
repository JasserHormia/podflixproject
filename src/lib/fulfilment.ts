import type Stripe from "stripe";
import { cancelCalBooking, confirmCalBooking } from "@/lib/cal";
import { sendBookingEmail, type BookingEmailData } from "@/lib/email";
import { stripeClient } from "@/lib/stripe";

/**
 * The one place a booking is fulfilled or released.
 *
 * Both the Stripe webhook and the reconciliation cron call these, so the two
 * paths cannot drift: whatever the webhook does on payment success, the cron
 * does identically when a webhook never arrives.
 *
 * ── Idempotency ──
 * Stripe retries webhooks, and the cron may race a late webhook, so every
 * action must be safe to attempt twice. State lives in two layers:
 *
 *   1. A per-instance Set of Stripe event ids — catches rapid retries hitting
 *      the same warm lambda. Free, but lost on cold start.
 *   2. A marker written back to the PaymentIntent's own metadata
 *      (podflixFulfilledAt / podflixReleasedAt) — durable, survives restarts,
 *      and needs no database. The PaymentIntent is already the record that
 *      ties payment to booking, so the marker lives with the thing it
 *      describes.
 *
 * Tradeoff: read-then-write on Stripe metadata is not atomic, so two truly
 * simultaneous deliveries could both pass the check. The window is a few
 * hundred milliseconds and the worst case is a duplicate email, never a
 * double charge or a double booking. A real lock needs a database, which this
 * project does not have.
 */

const MARK_FULFILLED = "podflixFulfilledAt";
const MARK_RELEASED = "podflixReleasedAt";

/** Layer 1: rapid same-instance retries. */
const seenEvents = new Set<string>();

export function alreadyHandledEvent(eventId: string) {
  if (seenEvents.has(eventId)) return true;
  seenEvents.add(eventId);
  // Keep the set from growing without bound on a long-lived instance.
  if (seenEvents.size > 500) {
    for (const id of Array.from(seenEvents).slice(0, 250)) seenEvents.delete(id);
  }
  return false;
}

export function emailDataFrom(pi: Stripe.PaymentIntent): BookingEmailData {
  const m = pi.metadata ?? {};
  return {
    to: m.attendeeEmail ?? "",
    name: m.attendeeName ?? "there",
    sessionName: m.sessionName ?? "your session",
    start: m.startsAt ?? new Date().toISOString(),
    hours: Number(m.hours) || 1,
    format: m.format || undefined,
    setName: m.setName || undefined,
    addons: m.addons ? m.addons.split(",").map((a) => a.trim()).filter(Boolean) : [],
    total: pi.amount / 100,
  };
}

async function mark(pi: Stripe.PaymentIntent, key: string) {
  try {
    await stripeClient().paymentIntents.update(pi.id, {
      metadata: { ...pi.metadata, [key]: new Date().toISOString() },
    });
  } catch (err) {
    // A missing marker only risks a duplicate email on retry — never fail the
    // fulfilment over it.
    console.error("[fulfilment] could not write marker", key, pi.id, err);
  }
}

export type FulfilResult = { done: boolean; skipped?: string; emailed?: boolean };

/**
 * Payment succeeded: confirm the booking and tell the customer.
 *
 * Our email is sent BEFORE confirming with Cal, deliberately. Confirming
 * triggers Cal's own notification, and the client accepts two emails per
 * booking for now — so ours must land first and be the one read first.
 */
export async function fulfilBooking(
  pi: Stripe.PaymentIntent,
  source: "webhook" | "reconcile"
): Promise<FulfilResult> {
  const uid = pi.metadata?.calBookingUid;
  if (!uid) return { done: false, skipped: "no calBookingUid" };
  if (pi.metadata?.[MARK_FULFILLED]) {
    console.info(`[fulfilment:${source}] already fulfilled`, uid);
    return { done: false, skipped: "already fulfilled" };
  }

  const data = emailDataFrom(pi);
  const emailed = data.to ? (await sendBookingEmail("confirmation", data)).ok : false;

  const res = await confirmCalBooking(uid);
  if (!res.ok) {
    // Not necessarily fatal: if the event type does not require confirmation
    // the booking is already accepted and there is nothing to promote.
    console.error(`[fulfilment:${source}] confirm failed`, uid, res.status, res.detail);
  } else {
    console.info(`[fulfilment:${source}] confirmed`, uid, res.data.status);
  }

  await mark(pi, MARK_FULFILLED);
  return { done: true, emailed };
}

/** Payment failed, was cancelled, or never happened: release the slot. */
export async function releaseBooking(
  pi: Stripe.PaymentIntent,
  reason: string,
  source: "webhook" | "reconcile"
): Promise<FulfilResult> {
  const uid = pi.metadata?.calBookingUid;
  if (!uid) return { done: false, skipped: "no calBookingUid" };
  if (pi.metadata?.[MARK_RELEASED]) {
    console.info(`[fulfilment:${source}] already released`, uid);
    return { done: false, skipped: "already released" };
  }

  const res = await cancelCalBooking(uid, reason);
  console.info(`[fulfilment:${source}] released`, uid, res.ok ? res.data.status : res.detail);

  const data = emailDataFrom(pi);
  const emailed = data.to
    ? (await sendBookingEmail("cancellation", { ...data, reason })).ok
    : false;

  await mark(pi, MARK_RELEASED);
  return { done: true, emailed };
}
