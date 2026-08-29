import type Stripe from "stripe";
import { CAL_API_BASE, calApiKey, cancelCalBooking } from "@/lib/cal";
import { fulfilBooking, releaseBooking } from "@/lib/fulfilment";
import { stripeClient } from "@/lib/stripe";

/**
 * GET/POST /api/cron/reconcile — the safety net for a webhook that never came.
 *
 * Stripe retries for about three days, so this mostly covers the case where a
 * delivery is lost entirely or our endpoint was down past the retry window.
 * Without it a paid customer's booking sits pending forever and nobody notices.
 *
 * Protected by CRON_SECRET; Vercel Cron sends it as a bearer token.
 */

const PENDING_GRACE_MS = 15 * 60 * 1000; // ignore bookings younger than this
const NO_INTENT_CUTOFF_MS = 30 * 60 * 1000; // no payment at all by now → release
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Cal's documented `status=unconfirmed` filter did not return this account's
// pending bookings, so the window is fetched and filtered here instead.
const LIST_VERSION = "2026-05-01";

type CalListBooking = {
  uid: string;
  status: string;
  start: string;
  createdAt: string;
};

async function pendingBookings(): Promise<CalListBooking[]> {
  const after = new Date(Date.now() - MAX_AGE_MS).toISOString();
  const url = `${CAL_API_BASE}/bookings?limit=100&afterCreatedAt=${encodeURIComponent(after)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${calApiKey()}`,
      "cal-api-version": LIST_VERSION,
    },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as
    | { data?: CalListBooking[] }
    | null;
  if (!res.ok || !body?.data) return [];
  return body.data.filter((b) => b.status === "pending");
}

/**
 * Finds the PaymentIntent we created for a given Cal booking.
 *
 * Search is tried first, but Stripe's search index is eventually consistent —
 * a freshly created intent can be missing from it for around a minute. Since
 * a false "no payment" reading would cancel a *paid* booking, a miss falls
 * back to scanning recent intents directly, which is strongly consistent.
 */
async function intentFor(uid: string): Promise<Stripe.PaymentIntent | null> {
  const stripe = stripeClient();
  const safe = uid.replace(/[^A-Za-z0-9_-]/g, "");
  try {
    const found = await stripe.paymentIntents.search({
      query: `metadata['calBookingUid']:'${safe}'`,
      limit: 1,
    });
    if (found.data[0]) return found.data[0];
  } catch (err) {
    console.error("[reconcile] Stripe search failed, falling back to list", uid, err);
  }
  try {
    const recent = await stripe.paymentIntents.list({ limit: 100 });
    return recent.data.find((p) => p.metadata?.calBookingUid === uid) ?? null;
  } catch (err) {
    console.error("[reconcile] Stripe list failed", uid, err);
    return null;
  }
}

async function handle(force = false) {
  const now = Date.now();
  const bookings = await pendingBookings();
  const report = {
    scanned: bookings.length,
    confirmed: 0,
    released: 0,
    skipped: 0,
    tooRecent: 0,
    past: 0,
    failed: 0,
    details: [] as { uid: string; action: string; note?: string }[],
  };

  for (const b of bookings) {
    const age = now - Date.parse(b.createdAt);
    if (!force && (Number.isNaN(age) || age < PENDING_GRACE_MS)) {
      report.tooRecent++;
      continue;
    }
    if (age > MAX_AGE_MS) {
      report.skipped++;
      continue;
    }
    // Cal rejects cancelling a booking that has already ended, so a past slot
    // can never be released and retrying it every 15 minutes is pure noise.
    // The slot is gone either way; nothing is being held.
    if (Date.parse(b.start) < now) {
      report.past++;
      continue;
    }

    const pi = await intentFor(b.uid);

    if (!pi) {
      // No payment was ever started for this booking. Past the cutoff it is a
      // dead checkout holding a slot; before it, the customer may still be
      // typing their card details.
      // Deliberately NOT influenced by `force`: releasing on a missing intent
      // is the one irreversible action here, and the cutoff is what stops a
      // lagging lookup from cancelling a booking that was actually paid.
      if (age > NO_INTENT_CUTOFF_MS) {
        const res = await cancelCalBooking(b.uid, "No payment received");
        if (res.ok) report.released++;
        else report.failed++;
        report.details.push({
          uid: b.uid,
          action: res.ok ? "released" : "cancel-failed",
          note: res.ok ? "no payment intent" : String(res.detail).slice(0, 120),
        });
      } else {
        report.tooRecent++;
      }
      continue;
    }

    if (pi.status === "succeeded") {
      const r = await fulfilBooking(pi, "reconcile");
      if (r.done) report.confirmed++;
      else report.skipped++;
      report.details.push({ uid: b.uid, action: r.done ? "confirmed" : "skipped", note: r.skipped });
    } else if (pi.status === "canceled" || age > NO_INTENT_CUTOFF_MS) {
      const r = await releaseBooking(pi, "Payment was not completed", "reconcile");
      if (r.done) report.released++;
      else report.skipped++;
      report.details.push({ uid: b.uid, action: r.done ? "released" : "skipped", note: r.skipped });
    } else {
      report.tooRecent++;
    }
  }

  console.info("[reconcile]", JSON.stringify(report));
  return report;
}

function authorised(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // `force` skips the age grace period. Behind CRON_SECRET, so it doubles as
  // a manual "reconcile now" for operators as well as a test hook.
  const force = new URL(request.url).searchParams.get("force") === "1";
  return Response.json(await handle(force));
}

export const POST = GET;
