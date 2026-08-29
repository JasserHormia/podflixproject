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
