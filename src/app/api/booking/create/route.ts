import { ADDONS } from "@/lib/booking";
import { promoPrice } from "@/lib/promo";
import {
  CAL_SESSIONS,
  cancelCalBooking,
  createCalBooking,
  getCalSession,
  isSlotAvailable,
  type CalSessionId,
} from "@/lib/cal";
import { findIntentForBooking, isReusableIntent, stripeClient, toFils } from "@/lib/stripe";

/**
 * POST /api/booking/create — the single entry point for a booking.
 *
 * Order matters: the Cal booking is created first so the slot is held while
 * the customer pays. If the PaymentIntent then fails to create, the booking is
 * cancelled immediately rather than leaving a ghost holding a slot.
 *
 * The amount is computed here from CAL_SESSIONS and ADDONS. Nothing about
 * price, currency or event type id is taken from the request body.
 *
 * While the launch promotion runs, every component of the total goes through
 * promoPrice() — the session and each addon individually, matching how they
 * are displayed and rounded on screen. Discounting the summed total instead
 * would round once rather than per line and could differ by a dirham from the
 * figure the customer just agreed to.
 */

type Body = {
  sessionId?: unknown;
  start?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  metadata?: { format?: unknown; setName?: unknown; addons?: unknown };
};

const bad = (status: number, message: string) =>
  Response.json({ error: message }, { status });

const str = (v: unknown, max = 200) =>
  typeof v === "string" && v.trim() && v.length <= max ? v.trim() : null;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return bad(400, "Request body must be JSON.");
  }

  // ── a. validate, and resolve the session server-side ──
  const sessionId = str(body.sessionId, 40) as CalSessionId | null;
  const session = sessionId
    ? CAL_SESSIONS.find((s) => s.id === sessionId)
    : undefined;
  if (!session) return bad(400, "Unknown sessionId.");

  const start = str(body.start, 40);
  if (!start || Number.isNaN(Date.parse(start))) {
    return bad(400, "start must be an ISO 8601 datestring.");
  }
  if (Date.parse(start) < Date.now()) {
    return bad(400, "start must be in the future.");
  }

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  if (!name) return bad(400, "name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return bad(400, "A valid email is required.");
  }
  if (!phone) return bad(400, "phone is required.");

  // ── b. amount, computed here and nowhere else ──
  const requested = Array.isArray(body.metadata?.addons)
    ? (body.metadata.addons as unknown[]).map((a) => str(a, 60))
    : [];
  if (requested.some((a) => a === null)) return bad(400, "Malformed addon id.");
  const addons = ADDONS.filter((a) => requested.includes(a.id));
  if (addons.length !== requested.length) return bad(400, "Unknown addon id.");

  // promoPrice() per line, not on the sum — see the note at the top of the
  // file. Reverts to the original figures the moment PROMO_ACTIVE is false.
  const total =
    promoPrice(session.price) +
    addons.reduce((sum, a) => sum + promoPrice(a.price), 0);

  const format = str(body.metadata?.format, 60) ?? "";
  const setName = str(body.metadata?.setName, 120) ?? "";
  const addonNames = addons.map((a) => a.name).join(", ");
  const detail = getCalSession(session.id);

  // ── c. confirm the slot is still free, then hold it ──
  // Availability was last fetched when the picker loaded; someone else may
  // have taken this time while the customer was filling the form.
  const available = await isSlotAvailable(session.calId, start);
  if (available === false) {
    return bad(409, "That time has just been taken. Please pick another slot.");
  }
  if (available === null) {
    // Inconclusive: proceed rather than block a real booking on a transient
    // error. Cal still rejects a genuine collision when the booking is written.
    console.warn("[booking/create] availability inconclusive, proceeding", session.calId, start);
  }

  const booking = await createCalBooking({
    eventTypeId: session.calId,
    start,
    name,
    email,
    metadata: {
      sessionId: session.id,
      sessionName: session.name,
      priceAed: String(total),
      hours: String(session.hours),
      phone,
      ...(format ? { format } : {}),
      ...(setName ? { setName } : {}),
      ...(addonNames ? { addons: addonNames } : {}),
    },
  });

  if (!booking.ok) {
    // Cal answers a genuine collision with 409 / ConflictException ("User
    // either already has booking at this time or is not available"), and 400
    // for malformed input. Matching the status rather than the message means a
    // Cal wording change cannot silently reclassify this.
    //
    // The pre-check above misses sub-minute races because Cal's availability
    // propagates on a delay, so this is where those land — and they deserve
    // the same 409 the pre-check gives, not a 502 that implies our fault.
    if (booking.status === 409) {
      console.info("[booking/create] slot taken at write time", session.calId, start);
      return bad(409, "That time has just been taken. Please pick another slot.");
    }
    console.error("[booking/create] Cal booking failed", booking.status, booking.detail);
    return bad(502, "Could not reach the booking system. Please try again.");
  }

  // ── d. payment intent ──
  try {
    const stripe = stripeClient();

    // Reuse rather than mint a second intent for the same booking. Cal returns
    // the existing booking when the same customer submits twice, so without
    // this a double-submit leaves an orphaned intent behind every time.
    const existing = await findIntentForBooking(booking.data.uid);
    if (existing) {
      if (existing.status === "succeeded") {
        return bad(409, "This booking has already been paid for.");
      }
      if (isReusableIntent(existing.status) && existing.client_secret) {
        const reused =
          existing.amount === toFils(total)
            ? existing
            : // The selection changed between attempts; correct the amount
              // rather than abandoning the intent and creating another.
              await stripe.paymentIntents.update(existing.id, {
                amount: toFils(total),
              });
        console.info("[booking/create] reusing intent", reused.id, "for", booking.data.uid);
        return Response.json({
          clientSecret: reused.client_secret,
          bookingUid: booking.data.uid,
          total,
          sessionName: session.name,
          hours: session.hours,
          includes: detail?.includes ?? [],
          reusedIntent: true,
        });
      }
    }

    const intent = await stripe.paymentIntents.create({
      amount: toFils(total),
      currency: "aed",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `${session.name} — Podflix`,
      metadata: {
        calBookingUid: booking.data.uid,
        sessionId: session.id,
        sessionName: session.name,
        hours: String(session.hours),
        format,
        setName,
        addons: addonNames,
        phone,
        attendeeName: name,
        attendeeEmail: email,
        startsAt: booking.data.start ?? start,
      },
    });

    if (!intent.client_secret) throw new Error("PaymentIntent has no client_secret");

    return Response.json({
      clientSecret: intent.client_secret,
      bookingUid: booking.data.uid,
      total,
      sessionName: session.name,
      hours: session.hours,
      includes: detail?.includes ?? [],
    });
  } catch (err) {
    // ── e. payment setup failed → release the slot immediately ──
    console.error("[booking/create] Stripe failed, cancelling Cal booking", err);
    const undo = await cancelCalBooking(
      booking.data.uid,
      "Payment could not be initialised"
    );
    if (!undo.ok) {
      console.error("[booking/create] ROLLBACK FAILED — slot may be held", booking.data.uid, undo.detail);
    }
    return bad(502, "Could not start the payment. Please try again.");
  }
}
