import { cancelCalBooking, getCalBooking } from "@/lib/cal";

/**
 * POST /api/booking/cancel — releases a held slot.
 *
 * Called when the customer abandons or fails payment, so dead checkouts do
 * not sit on the calendar. Idempotent: cancelling an already-cancelled
 * booking is a success, not an error.
 */

const bad = (status: number, message: string) =>
  Response.json({ error: message }, { status });

export async function POST(request: Request) {
  let body: { bookingUid?: unknown; reason?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return bad(400, "Request body must be JSON.");
  }

  const uid = body.bookingUid;
  // Cal uids are short url-safe tokens; reject anything else before calling out.
  if (typeof uid !== "string" || !/^[A-Za-z0-9_-]{6,64}$/.test(uid)) {
    return bad(400, "Invalid bookingUid.");
  }

  const reason =
    typeof body.reason === "string" && body.reason.trim()
      ? body.reason.trim().slice(0, 200)
      : "Payment not completed";

  const existing = await getCalBooking(uid);
  if (existing.ok && existing.data.status === "cancelled") {
    return Response.json({ ok: true, status: "cancelled", alreadyCancelled: true });
  }

  const res = await cancelCalBooking(uid, reason);
  if (!res.ok) {
    // Treat "already cancelled" upstream as success too — the goal is a
    // released slot, and it is released either way.
    console.error("[booking/cancel] upstream", res.status, res.detail);
    if (existing.ok) {
      return Response.json({ ok: true, status: "unknown", note: "Cal rejected the cancel" });
    }
    return bad(502, "Could not cancel the booking.");
  }

  return Response.json({ ok: true, status: res.data.status ?? "cancelled" });
}
