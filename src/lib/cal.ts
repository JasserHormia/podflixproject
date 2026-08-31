/**
 * Cal.com backend map.
 *
 * Day 1 of the custom booking engine: Cal.com becomes the scheduling backend
 * while we own the entire UI. This module is the single place that knows which
 * of our sessions maps to which Cal event type.
 *
 * Nothing here is client-safe by accident — the API key lives only in
 * CAL_API_KEY (no NEXT_PUBLIC_ prefix) and is read exclusively by the route
 * handlers under src/app/api/cal/.
 *
 * The existing SimplyBook flow is untouched and stays live until this is
 * proven; both maps coexist deliberately.
 */

import { SESSIONS } from "@/lib/booking";

export const TIMEZONE = "Asia/Dubai";

/** Cal.com API v2. Versions are per-endpoint — see the route handlers. */
export const CAL_API_BASE = "https://api.cal.com/v2";

export const CAL_SESSIONS = [
  { id: "rec-1h", name: "1 Hour Recording", category: "studio", hours: 1, price: 590, calId: 6839068 },
  { id: "rec-2h", name: "2 Hour Recording", category: "studio", hours: 2, price: 1180, calId: 6839134, recommended: true },
  { id: "rec-3h", name: "3 Hour Recording", category: "studio", hours: 3, price: 1770, calId: 6841766 },
  { id: "rec-4h", name: "4 Hour Recording", category: "studio", hours: 4, price: 2360, calId: 6841782 },
  { id: "rec-5h", name: "5 Hour Recording", category: "studio", hours: 5, price: 2950, calId: 6841872 },
  { id: "edit-1h", name: "1 Hour + Editing", category: "editing", hours: 1, price: 1190, calId: 6841899 },
  { id: "edit-2h", name: "2 Hour + Editing", category: "editing", hours: 2, price: 2380, calId: 6841921, recommended: true },
  { id: "edit-3h", name: "3 Hour + Editing", category: "editing", hours: 3, price: 3570, calId: 6841927 },
  { id: "signature", name: "Signature Episode + Dynamic Edit", category: "package", hours: 2, price: 3499, calId: 6841998 },
  { id: "signature-reels", name: "Signature Episode + Dynamic Edit + 3 Reels", category: "package", hours: 2, price: 4499, calId: 6842437, recommended: true },
  { id: "reels-5", name: "5 Reels Package", category: "package", hours: 1, price: 2499, calId: 6842442 },
  { id: "reels-10", name: "10 Reels Package", category: "package", hours: 2, price: 4999, calId: 6842466 },
] as const;

export type CalSession = (typeof CAL_SESSIONS)[number];
export type CalSessionId = CalSession["id"];

/**
 * Cal id → the id used by the live SimplyBook flow. Taglines, descriptions,
 * includes and revision policy are read across rather than duplicated, so the
 * two systems cannot drift while both exist.
 */
const CAL_TO_BOOKING: Record<CalSessionId, string> = {
  "rec-1h": "studio-1h",
  "rec-2h": "studio-2h",
  "rec-3h": "studio-3h",
  "rec-4h": "studio-4h",
  "rec-5h": "studio-5h",
  "edit-1h": "edit-1h",
  "edit-2h": "edit-2h",
  "edit-3h": "edit-3h",
  signature: "signature",
  "signature-reels": "signature-reels",
  "reels-5": "reels-5",
  "reels-10": "reels-10",
};

/** A Cal session with the marketing copy carried over from booking.ts. */
export function getCalSession(id: CalSessionId) {
  const cal = CAL_SESSIONS.find((s) => s.id === id);
  if (!cal) return null;
  const detail = SESSIONS.find((s) => s.id === CAL_TO_BOOKING[id]);
  return {
    ...cal,
    tagline: detail?.tagline ?? "",
    description: detail?.description ?? "",
    includes: detail?.includes ?? [],
    revisions: detail?.revisions ?? null,
  };
}

/** All Cal sessions, copy included, in display order. */
export const calSessions = () =>
  CAL_SESSIONS.map((s) => getCalSession(s.id)!).filter(Boolean);

/** Guard for anything arriving from the client — never trust a raw id. */
export const isKnownCalId = (calId: unknown): calId is number =>
  typeof calId === "number" &&
  CAL_SESSIONS.some((s) => s.calId === calId);

/** The session behind a Cal event type id, or null if we do not own it. */
export const sessionByCalId = (calId: number) =>
  CAL_SESSIONS.find((s) => s.calId === calId) ?? null;

/** Reads the key at call time so a missing env fails loudly in the route. */
export function calApiKey() {
  const key = process.env.CAL_API_KEY;
  if (!key) throw new Error("CAL_API_KEY is not set");
  return key;
}

/* ── Cal API operations ───────────────────────────────────────────────
   Versions are pinned per endpoint and differ; see the report. Shared here
   so every route speaks to Cal the same way.                            */

export const CAL_VERSION = {
  /** GET /v2/slots */
  slots: "2024-09-04",
  /** POST /v2/bookings */
  createBooking: "2026-02-25",
  /** POST /v2/bookings/{uid}/confirm */
  confirmBooking: "2026-02-25",
  /** POST /v2/bookings/{uid}/cancel, GET /v2/bookings/{uid} */
  bookingOps: "2024-08-13",
} as const;

type CalResult<T> = { ok: true; data: T } | { ok: false; status: number; detail: unknown };

async function calFetch<T>(
  path: string,
  version: string,
  init?: RequestInit
): Promise<CalResult<T>> {
  try {
    const res = await fetch(`${CAL_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${calApiKey()}`,
        "cal-api-version": version,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    const body = (await res.json().catch(() => null)) as
      | { status?: string; data?: T; error?: unknown }
      | null;
    if (!res.ok || !body?.data) {
      return { ok: false, status: res.status, detail: body?.error ?? body };
    }
    return { ok: true, data: body.data };
  } catch (err) {
    return { ok: false, status: 0, detail: err };
  }
}

export type CalBooking = {
  uid: string;
  status: string;
  start: string;
  end: string;
  title?: string;
};

/** Creates the booking that holds the slot. */
export function createCalBooking(input: {
  eventTypeId: number;
  start: string;
  name: string;
  email: string;
  metadata: Record<string, string>;
}) {
  return calFetch<CalBooking>("/bookings", CAL_VERSION.createBooking, {
    method: "POST",
    body: JSON.stringify({
      start: input.start,
      eventTypeId: input.eventTypeId,
      attendee: {
        name: input.name,
        email: input.email,
        timeZone: TIMEZONE,
        language: "en",
      },
      metadata: input.metadata,
    }),
  });
}

/** Promotes a pending booking to accepted. Requires the event type to have
 *  "requires confirmation" enabled — otherwise bookings arrive accepted and
 *  this is a no-op. */
export function confirmCalBooking(uid: string) {
  return calFetch<CalBooking>(
    `/bookings/${encodeURIComponent(uid)}/confirm`,
    CAL_VERSION.confirmBooking,
    { method: "POST" }
  );
}

/** Releases the slot. Safe to call on an already-cancelled booking. */
export function cancelCalBooking(uid: string, reason: string) {
  return calFetch<CalBooking>(
    `/bookings/${encodeURIComponent(uid)}/cancel`,
    CAL_VERSION.bookingOps,
    { method: "POST", body: JSON.stringify({ cancellationReason: reason }) }
  );
}

export function getCalBooking(uid: string) {
  return calFetch<CalBooking>(
    `/bookings/${encodeURIComponent(uid)}`,
    CAL_VERSION.bookingOps
  );
}

/**
 * Is this exact start still offered for the event type?
 *
 * Availability is fetched when the customer opens the picker, but they then
 * spend a while choosing and typing card details. Re-checking immediately
 * before the booking is written narrows the double-booking window from the
 * length of a checkout down to the round trip of this call.
 *
 * Returns `null` when availability could not be determined — the caller should
 * proceed rather than block a legitimate booking on a transient error, since
 * Cal itself still rejects a genuine collision at creation time.
 */
export async function isSlotAvailable(
  eventTypeId: number,
  startIso: string
): Promise<boolean | null> {
  const target = Date.parse(startIso);
  if (Number.isNaN(target)) return false;

  // Two things about Cal's /slots endpoint drive this window, and getting
  // either wrong reads as "slot taken":
  //
  //   1. It only returns a slot if the FULL session duration fits inside the
  //      requested range. A fixed one-hour window therefore returned nothing
  //      for every session longer than an hour.
  //   2. It generates the slot grid FROM the requested start. Asking from
  //      target-1h shifts the grid by an hour, so an 11:00 slot comes back as
  //      10:00 and 12:00 and the exact match fails.
  //
  // So: start exactly on the target, and extend the end past the session's
  // length. The extra hour is slack, and only ever widens what is returned.
  const hours = sessionByCalId(eventTypeId)?.hours ?? 1;
  const from = new Date(target).toISOString();
  const to = new Date(target + (hours + 1) * 60 * 60 * 1000).toISOString();
  const query = new URLSearchParams({
    eventTypeId: String(eventTypeId),
    start: from,
    end: to,
    timeZone: TIMEZONE,
  });

  const res = await calFetch<Record<string, { start: string }[]>>(
    `/slots?${query}`,
    CAL_VERSION.slots
  );
  if (!res.ok) {
    console.warn("[cal] availability check failed", eventTypeId, res.status, res.detail);
    return null;
  }

  // Compare instants, not strings: the same moment can be expressed with a
  // different offset or as Z, and both are legitimate input.
  return Object.values(res.data)
    .flat()
    .some((slot) => Date.parse(slot.start) === target);
}

/** Cal session for a session id used by the booking flow's steps 1-3. */
export const calSessionForBookingId = (bookingSessionId: string) => {
  const match = (Object.keys(CAL_TO_BOOKING) as CalSessionId[]).find(
    (calId) => CAL_TO_BOOKING[calId] === bookingSessionId
  );
  return match ? (CAL_SESSIONS.find((s) => s.id === match) ?? null) : null;
};
