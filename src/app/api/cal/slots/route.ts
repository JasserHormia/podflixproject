import {
  CAL_API_BASE,
  TIMEZONE,
  calApiKey,
  isKnownCalId,
} from "@/lib/cal";

/**
 * GET /api/cal/slots?eventTypeId=&startTime=&endTime=
 *
 * Server-side proxy for Cal.com's availability. The browser never sees the API
 * key and never talks to Cal directly.
 *
 * Cal API version: 2024-09-04 (the slots endpoint pins its own version —
 * omitting the header silently falls back to an older response shape).
 *
 * Note the parameter rename: our callers send startTime/endTime, Cal expects
 * start/end. Keeping our names stable means a Cal-side rename cannot reach
 * the UI.
 */

const CAL_SLOTS_VERSION = "2024-09-04";

/** Cal returns slots grouped by date: { "2026-08-30": [{ start, end? }] }. */
type CalSlotsResponse = {
  status?: string;
  data?: Record<string, { start: string }[]>;
  error?: unknown;
};

export type SlotsPayload = {
  slots: { date: string; times: string[] }[];
};

const bad = (status: number, message: string) =>
  Response.json({ error: message }, { status });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventTypeIdRaw = searchParams.get("eventTypeId");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");

  if (!eventTypeIdRaw || !startTime || !endTime) {
    return bad(400, "eventTypeId, startTime and endTime are all required.");
  }

  const eventTypeId = Number(eventTypeIdRaw);
  // Never trust the client for which event type it may query.
  if (!isKnownCalId(eventTypeId)) {
    return bad(400, "Unknown eventTypeId.");
  }
  if (Number.isNaN(Date.parse(startTime)) || Number.isNaN(Date.parse(endTime))) {
    return bad(400, "startTime and endTime must be ISO 8601 datestrings.");
  }
  if (Date.parse(endTime) <= Date.parse(startTime)) {
    return bad(400, "endTime must be after startTime.");
  }

  const url = new URL(`${CAL_API_BASE}/slots`);
  url.searchParams.set("eventTypeId", String(eventTypeId));
  url.searchParams.set("start", startTime);
  url.searchParams.set("end", endTime);
  url.searchParams.set("timeZone", TIMEZONE);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${calApiKey()}`,
        "cal-api-version": CAL_SLOTS_VERSION,
      },
      cache: "no-store",
    });
  } catch (err) {
    // Log the detail server-side; the client gets nothing exploitable.
    console.error("[cal/slots] network error", err);
    return bad(502, "Could not reach the booking system.");
  }

  const body = (await res.json().catch(() => null)) as CalSlotsResponse | null;

  if (!res.ok || !body?.data) {
    console.error("[cal/slots] upstream error", res.status, body);
    return bad(502, "The booking system did not return availability.");
  }

  // Normalise to a shape we own, so Cal's response can change without
  // reaching the UI. Times stay full ISO strings — lossless, and the exact
  // value the booking call needs back.
  const slots = Object.entries(body.data)
    .map(([date, entries]) => ({
      date,
      times: (entries ?? []).map((e) => e.start).filter(Boolean),
    }))
    .filter((d) => d.times.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  return Response.json({ slots } satisfies SlotsPayload);
}
