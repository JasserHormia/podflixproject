/**
 * Booking flow data — the single source of truth for everything priced or
 * selectable on /booking. No price may be invented at a call site; if a number
 * is not in this file, it does not go on screen.
 *
 * The front end owns headcount → format → set → session type. Calendar slots,
 * availability and payment belong to Simplybook.me (Stage 2).
 */

import IMAGES from "@/lib/images";

/* ── Formats ─────────────────────────────────────────────────────────── */

export const FORMATS = {
  solo: { id: "solo", name: "Solo", capacity: [1], themeCount: 7 },
  duo: { id: "duo", name: "Duo", capacity: [2], themeCount: 3 },
  quattro: { id: "quattro", name: "Quattro", capacity: [3, 4], themeCount: 2 },
} as const;

export type FormatId = keyof typeof FORMATS;

/** Seats map to a format: 1 → Solo, 2 → Duo, 3–4 → Quattro. */
export const headcountToFormat = (n: number): FormatId =>
  n === 1 ? "solo" : n === 2 ? "duo" : "quattro";

/* ── Sets ────────────────────────────────────────────────────────────── */

export type StudioSet = {
  id: string;
  name: string;
  image: string;
  moods: string[];
};

/**
 * One entry per themed set, backed by a real photograph.
 *
 * NAMES ARE PLACEHOLDER — the client is naming these. Each `name` is a
 * standalone string literal so renaming a set is a one-line edit; nothing
 * derives a label from the id.
 *
 * Counts match FORMATS[*].themeCount exactly: 7 Solo, 3 Duo, 2 Quattro.
 * Quattro has two because only two distinct Quattro frames exist — the
 * delivered quattro-03 is byte-identical to quattro-02.
 */
export const SETS: Record<FormatId, StudioSet[]> = {
  solo: [
    { id: "solo-01", name: "Set 01", image: IMAGES.solo_1, moods: ["Navy", "Formal"] },
    { id: "solo-02", name: "Set 02", image: IMAGES.solo_2, moods: ["Minimal", "Warm"] },
    { id: "solo-03", name: "Set 03", image: IMAGES.solo_3, moods: ["Lounge", "Soft"] },
    { id: "solo-04", name: "Set 04", image: IMAGES.solo_4, moods: ["Moody", "Intimate"] },
    { id: "solo-05", name: "Set 05", image: IMAGES.solo_4b, moods: ["Bright", "Editorial"] },
    { id: "solo-06", name: "Set 06", image: IMAGES.solo_5, moods: ["Desk", "Focused"] },
    { id: "solo-07", name: "Set 07", image: IMAGES.solo_5b, moods: ["Studio", "Clean"] },
  ],
  duo: [
    { id: "duo-01", name: "Set 01", image: IMAGES.duo_1, moods: ["Lounge", "Warm"] },
    { id: "duo-02", name: "Set 02", image: IMAGES.duo_2, moods: ["Navy", "Formal"] },
    { id: "duo-03", name: "Set 03", image: IMAGES.duo_3, moods: ["Table", "Modern"] },
  ],
  quattro: [
    { id: "quattro-01", name: "Set 01", image: IMAGES.quattro_1, moods: ["Table", "Panel"] },
    { id: "quattro-02", name: "Set 02", image: IMAGES.quattro_2, moods: ["Lounge", "Warm"] },
  ],
};

/** Chosen when the guest wants a recommendation instead of picking. */
export const UNDECIDED_SET = "undecided";

/* ── Pricing ─────────────────────────────────────────────────────────── */

/**
 * Studio rental rates. Deliberately NOT continuous — the stepper walks these
 * array indices, so the sequence is 1 → 2 → 3 → 4 → 5 → 8 → 12 hours.
 */
export const RENTAL_RATES = [
  { hours: 1, price: 650 },
  { hours: 2, price: 1250, recommended: true },
  { hours: 3, price: 1800 },
  { hours: 4, price: 2300 },
  { hours: 5, price: 2750 },
  { hours: 8, price: 4200 },
  { hours: 12, price: 6000 },
] as const;

/** Default stepper position — the recommended 2-hour rate. */
export const DEFAULT_RENTAL_INDEX = RENTAL_RATES.findIndex(
  (r) => "recommended" in r && r.recommended
);

export type Package = {
  id: string;
  name: string;
  duration: string;
  price: number;
  includes: string[];
  recommended?: boolean;
};

export const PACKAGES: Package[] = [
  {
    id: "prod",
    name: "Podcast Production",
    duration: "1 hour",
    price: 1500,
    includes: [
      "Full podcast edit",
      "Multi-camera editing",
      "Audio enhancement",
      "Color grading",
      "4K export",
    ],
  },
  {
    id: "reels-3",
    name: "Podcast + 3 Reels",
    duration: "1 hour",
    price: 1700,
    includes: [
      "3 edited reels",
      "Animated captions",
      "Motion graphics",
      "3-cam production",
      "Cinematic color grading",
    ],
  },
  {
    id: "reels-5",
    name: "Podcast + 5 Reels",
    duration: "1 hour",
    price: 2300,
    includes: [
      "5 edited reels",
      "Animated captions",
      "Motion graphics",
      "3-cam production",
      "Cinematic color grading",
    ],
    recommended: true,
  },
  {
    id: "reels-10",
    name: "Podcast + 10 Reels",
    duration: "2 hours",
    price: 4900,
    includes: [
      "10 edited reels",
      "Animated captions",
      "Motion graphics",
      "3-cam production",
      "Cinematic color grading",
    ],
  },
];

export const ADDON_REELS = { label: "Add 3 edited reels", price: 900 } as const;

/** Currency prefix — kept here so no component hardcodes it. */
export const CURRENCY = "AED";

/** Formats a number the way every price on the flow is displayed. */
export const formatPrice = (n: number) => `${CURRENCY} ${n.toLocaleString("en-US")}`;
