import {
  CAL_API_BASE,
  TIMEZONE,
  calApiKey,
  isKnownCalId,
  sessionByCalId,
} from "@/lib/cal";

/**
 * POST /api/cal/book
 *
 * Creates the booking server-side so the API key never reaches the browser.
 *
 * Cal API version: 2026-02-25 (the bookings endpoint requires this header;
 * it is a different version to the slots endpoint, which pins 2024-09-04).
 *
 * Price is never taken from the client — it is read from CAL_SESSIONS by
 * event type id, so a tampered request cannot book a session at the wrong
 * price. eventTypeId itself is checked against the same list.
 */

const CAL_BOOKINGS_VERSION = "2026-02-25";

type BookBody = {
  eventTypeId?: unknown;
  start?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  metadata?: { format?: unknown; setName?: unknown; addons?: unknown };
};

const bad = (status: number, message: string) =>
  Response.json({ error: message }, { status });

const str = (v: unknown, max = 200) =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max
    ? v.trim()
    : null;

export async function POST(request: Request) {
  let body: BookBody;
  try {
    body = (await request.json()) as BookBody;
  } catch {
    return bad(400, "Request body must be JSON.");
  }

  const eventTypeId = Number(body.eventTypeId);
  if (!isKnownCalId(eventTypeId)) {
    return bad(400, "Unknown eventTypeId.");
  }

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

  // Trusted server-side, never from the client.
  const session = sessionByCalId(eventTypeId)!;

  const addons = Array.isArray(body.metadata?.addons)
    ? (body.metadata.addons as unknown[])
        .map((a) => str(a, 80))
        .filter((a): a is string => a !== null)
        .slice(0, 10)
    : [];

  // Cal metadata values must be strings.
  const metadata: Record<string, string> = {
    sessionId: session.id,
    sessionName: session.name,
    priceAed: String(session.price),
    hours: String(session.hours),
    phone,
  };
  const format = str(body.metadata?.format, 80);
  const setName = str(body.metadata?.setName, 120);
  if (format) metadata.format = format;
  if (setName) metadata.setName = setName;
  if (addons.length) metadata.addons = addons.join(", ");

  let res: Response;
  try {
    res = await fetch(`${CAL_API_BASE}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${calApiKey()}`,
        "cal-api-version": CAL_BOOKINGS_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start,
        eventTypeId,
        attendee: { name, email, phoneNumber: phone, timeZone: TIMEZONE },
        metadata,
      }),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[cal/book] network error", err);
    return bad(502, "Could not reach the booking system.");
  }

  const payload = (await res.json().catch(() => null)) as
    | { status?: string; data?: Record<string, unknown>; error?: unknown }
    | null;

  if (!res.ok || !payload?.data) {
    console.error("[cal/book] upstream error", res.status, payload);
    return bad(502, "The booking could not be created.");
  }

  const data = payload.data;

  // Cal's documented booking response carries no payment URL. Paid event types
  // surface payment separately, so we look for it defensively rather than
  // assuming a field name, and return null when it is absent — Day 2 wires
  // whatever this turns out to be against a real paid event type.
  const payments = Array.isArray(data.payment) ? (data.payment as Record<string, unknown>[]) : [];
  const paymentUrl =
    (typeof data.paymentUrl === "string" && data.paymentUrl) ||
    (typeof payments[0]?.url === "string" && (payments[0].url as string)) ||
    (typeof payments[0]?.link === "string" && (payments[0].link as string)) ||
    null;

  return Response.json({
    bookingUid: typeof data.uid === "string" ? data.uid : null,
    paymentUrl,
    status: typeof data.status === "string" ? data.status : null,
  });
}
