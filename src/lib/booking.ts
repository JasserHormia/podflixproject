/**
 * Booking flow data — the single source of truth for everything priced or
 * selectable on /booking. No price may be invented at a call site; if a number
 * is not in this file, it does not go on screen.
 *
 * The front end owns headcount → format → set → session type. Calendar slots
 * and availability come from Cal.com and payment from Stripe, both behind our
 * own API routes — see lib/cal.ts and api/booking/create.
 */

import IMAGES from "@/lib/images";
import { promoPrice } from "@/lib/promo";

/**
 * Re-exported so a consumer can reach the promotion from the same module it
 * reads prices from. Both names resolve to the one definition in lib/promo.ts
 * — there is still exactly one flag to flip.
 */
export { PROMO_ACTIVE, PROMO_PERCENT, PROMO_LABEL, promoPrice } from "@/lib/promo";

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
  /** Descriptive alt — these are content photos, not decoration. */
  alt: string;
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
    { id: "solo-01", name: "Set 01", image: IMAGES.solo_1, moods: ["Navy", "Formal"], alt: "Solo podcast recording set in the navy panelled room — Podflix Studio, Business Bay Dubai" },
    { id: "solo-02", name: "Set 02", image: IMAGES.solo_2, moods: ["Minimal", "Warm"], alt: "Minimal solo podcast desk set under warm slatted light — Podflix Studio Dubai" },
    { id: "solo-03", name: "Set 03", image: IMAGES.solo_3, moods: ["Lounge", "Soft"], alt: "Solo lounge podcast set with boom microphone and floor lamp — Podflix Studio, Business Bay Dubai" },
    { id: "solo-04", name: "Set 04", image: IMAGES.solo_4, moods: ["Moody", "Intimate"], alt: "Moody solo podcast set with patterned backlight and salt lamp — Podflix Studio Dubai" },
    { id: "solo-05", name: "Set 05", image: IMAGES.solo_4b, moods: ["Bright", "Editorial"], alt: "Bright editorial solo podcast set beneath a gold orb lamp — Podflix Studio Dubai" },
    { id: "solo-06", name: "Set 06", image: IMAGES.solo_5, moods: ["Desk", "Focused"], alt: "Focused solo podcast desk set with a vertical light strip — Podflix Studio, Business Bay Dubai" },
    { id: "solo-07", name: "Set 07", image: IMAGES.solo_5b, moods: ["Studio", "Clean"], alt: "Clean solo podcast table set against the slatted wall and bookshelf — Podflix Studio Dubai" },
  ],
  duo: [
    { id: "duo-01", name: "Set 01", image: IMAGES.duo_1, moods: ["Lounge", "Warm"], alt: "Duo interview podcast set with two warm lounge armchairs — Podflix Studio Dubai" },
    { id: "duo-02", name: "Set 02", image: IMAGES.duo_2, moods: ["Navy", "Formal"], alt: "Formal duo interview podcast set in the navy panelled room — Podflix Studio, Business Bay Dubai" },
    { id: "duo-03", name: "Set 03", image: IMAGES.duo_3, moods: ["Table", "Modern"], alt: "Modern duo podcast set at the studio table — Podflix Studio Dubai" },
  ],
  quattro: [
    { id: "quattro-01", name: "Set 01", image: IMAGES.quattro_1, moods: ["Table", "Panel"], alt: "Four-person panel podcast set around the studio table — Podflix Studio, Business Bay Dubai" },
    { id: "quattro-02", name: "Set 02", image: IMAGES.quattro_2, moods: ["Lounge", "Warm"], alt: "Four-person panel podcast set with four lounge armchairs — Podflix Studio Dubai" },
  ],
};


/* ── Pricing ─────────────────────────────────────────────────────────── */

export type SessionCategory = "studio" | "editing" | "package";

export type Session = {
  id: string;
  name: string;
  tagline: string;
  /** Booked duration in hours. The display pill and the per-hour rate both
   *  derive from this, so a price and its rate can never disagree. */
  hours: number;
  price: number;
  category: SessionCategory;
  /** SimplyBook.me service id — deep-links the embed straight to its calendar. */
  sbId: number;
  description: string;
  includes: string[];
  /** Null where the session ships no edit, so no revision policy applies. */
  revisions: string | null;
  recommended?: boolean;
};

/**
 * Final client pricing. Studio time runs at a flat AED 590/hour and studio
 * with editing at AED 1,190/hour; packages are fixed-price products.
 *
 * Bookings of 8 hours or more are handled by the sales team rather than
 * self-checkout, so no session here exposes them — see EnterpriseBlock.
 */
export const SESSIONS: Session[] = [
  {
    id: "studio-1h",
    name: "1 Hour Studio",
    tagline:
      "Video + audio recording. Just record — we handle the rest.",
    hours: 1,
    price: 590,
    category: "studio",
    sbId: 2,
    description:
      "A fully equipped premium podcast studio for creators, entrepreneurs, brands and businesses who want professional-quality footage and audio.",
    includes: [
      "1 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Amaran studio lighting",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Raw video & audio footage available for 14 days",
    ],
    revisions: null,
  },
  {
    id: "studio-2h",
    name: "2 Hour Studio",
    tagline:
      "Video + audio recording. Just record — we handle the rest.",
    hours: 2,
    price: 1180,
    category: "studio",
    sbId: 8,
    recommended: true,
    description:
      "A fully equipped premium podcast studio for creators, entrepreneurs, brands and businesses who want professional-quality footage and audio.",
    includes: [
      "2 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Amaran studio lighting",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Raw video & audio footage available for 14 days",
    ],
    revisions: null,
  },
  {
    id: "studio-3h",
    name: "3 Hour Studio",
    tagline:
      "Video + audio recording. Just record — we handle the rest.",
    hours: 3,
    price: 1770,
    category: "studio",
    sbId: 9,
    description:
      "A fully equipped premium podcast studio for creators, entrepreneurs, brands and businesses who want professional-quality footage and audio.",
    includes: [
      "3 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Amaran studio lighting",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Raw video & audio footage available for 14 days",
    ],
    revisions: null,
  },
  {
    id: "studio-4h",
    name: "4 Hour Studio",
    tagline:
      "Video + audio recording. Just record — we handle the rest.",
    hours: 4,
    price: 2360,
    category: "studio",
    sbId: 10,
    description:
      "A fully equipped premium podcast studio for creators, entrepreneurs, brands and businesses who want professional-quality footage and audio.",
    includes: [
      "4 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Amaran studio lighting",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Raw video & audio footage available for 14 days",
    ],
    revisions: null,
  },
  {
    id: "studio-5h",
    name: "5 Hour Studio",
    tagline:
      "Video + audio recording. Just record — we handle the rest.",
    hours: 5,
    price: 2950,
    category: "studio",
    sbId: 11,
    description:
      "A fully equipped premium podcast studio for creators, entrepreneurs, brands and businesses who want professional-quality footage and audio.",
    includes: [
      "5 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Amaran studio lighting",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Raw video & audio footage available for 14 days",
    ],
    revisions: null,
  },
  {
    id: "edit-1h",
    name: "1 Hour + Editing",
    tagline:
      "Record, edit, publish. Ready-to-upload episode.",
    hours: 1,
    price: 1190,
    category: "editing",
    sbId: 3,
    description:
      "A complete podcast recording and editing experience for a professional, polished final episode.",
    includes: [
      "1 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Amaran studio lighting",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Multi-camera synchronization",
      "Full podcast episode edit",
      "Clean cuts & professional pacing",
      "Audio cleanup & mixing",
      "Color correction",
      "Basic titles & branding",
      "4K export · YouTube-ready final episode",
    ],
    revisions: "1 revision included",
  },
  {
    id: "edit-2h",
    name: "2 Hour + Editing",
    tagline:
      "Record, edit, publish. Ready-to-upload episode.",
    hours: 2,
    price: 2380,
    category: "editing",
    sbId: 4,
    recommended: true,
    description:
      "A complete podcast recording and editing experience for a professional, polished final episode.",
    includes: [
      "2 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Amaran studio lighting",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Multi-camera synchronization",
      "Full podcast episode edit",
      "Clean cuts & professional pacing",
      "Audio cleanup & mixing",
      "Color correction",
      "Basic titles & branding",
      "4K export · YouTube-ready final episode",
    ],
    revisions: "1 revision included",
  },
  {
    id: "edit-3h",
    name: "3 Hour + Editing",
    tagline:
      "Record, edit, publish. Ready-to-upload episode.",
    hours: 3,
    price: 3570,
    category: "editing",
    sbId: 5,
    description:
      "A complete podcast recording and editing experience for a professional, polished final episode.",
    includes: [
      "3 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Amaran studio lighting",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Multi-camera synchronization",
      "Full podcast episode edit",
      "Clean cuts & professional pacing",
      "Audio cleanup & mixing",
      "Color correction",
      "Basic titles & branding",
      "4K export · YouTube-ready final episode",
    ],
    revisions: "1 revision included",
  },
  {
    id: "signature",
    name: "Signature Episode + Dynamic Edit",
    tagline:
      "Our premium production experience.",
    hours: 2,
    price: 3499,
    category: "package",
    sbId: 6,
    description:
      "A highly creative, visually refined podcast production designed for creators, brands and personalities who want their episode to stand out.",
    includes: [
      "2 hour premium studio recording",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Amaran studio lighting",
      "Dedicated videographer",
      "Advanced multi-camera editing",
      "Advanced color grading",
      "Creative transitions",
      "Dynamic pacing",
      "Professional sound design",
      "Advanced titles & graphics",
      "Premium audio mastering",
      "4K export · YouTube-ready final episode",
    ],
    revisions: "2 revisions included",
  },
  {
    id: "signature-reels",
    name: "Signature Episode + Dynamic Edit + 3 Reels",
    tagline:
      "The complete Podflix experience.",
    hours: 2,
    price: 4499,
    category: "package",
    sbId: 7,
    description:
      "Our highest-level production: a signature episode transformed into premium long-form and short-form content.",
    includes: [
      "2 hour premium studio recording",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Amaran studio lighting",
      "Dedicated videographer",
      "Advanced multi-camera editing",
      "Advanced color grading",
      "Creative transitions",
      "Dynamic pacing",
      "Professional sound design",
      "Advanced titles & graphics",
      "Premium audio mastering",
      "4K export · YouTube-ready final episode",
      "3 Signature Reels",
      "Dynamic short-form editing",
      "Animated captions",
      "Hook-focused editing",
      "Motion graphics where appropriate",
      "9:16 social-media optimization",
      "Instagram / TikTok / YouTube Shorts ready",
    ],
    revisions: "2 revisions included",
  },
  {
    id: "reels-5",
    name: "5 Reels Package",
    tagline:
      "One recording. Five pieces of short-form content.",
    hours: 1,
    price: 2499,
    category: "package",
    sbId: 14,
    description:
      "Turn a single studio session into a run of scroll-stopping short-form content.",
    includes: [
      "1 hour studio recording",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Amaran studio lighting",
      "Dedicated videographer",
      "5 professionally edited Reels",
      "Dynamic short-form editing",
      "Animated captions",
      "Hook-focused editing",
      "Motion graphics where appropriate",
      "9:16 social-media optimization",
      "Instagram / TikTok / YouTube Shorts ready",
    ],
    revisions: "1 revision included",
  },
  {
    id: "reels-10",
    name: "10 Reels Package",
    tagline:
      "A full month of short-form in one session.",
    hours: 2,
    price: 4999,
    category: "package",
    sbId: 13,
    description:
      "A two-hour session cut into ten short-form pieces, ready to schedule across your channels.",
    includes: [
      "2 hour studio recording",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Amaran studio lighting",
      "Dedicated videographer",
      "10 professionally edited Reels",
      "Dynamic short-form editing",
      "Animated captions",
      "Hook-focused editing",
      "Motion graphics where appropriate",
      "9:16 social-media optimization",
      "Instagram / TikTok / YouTube Shorts ready",
    ],
    revisions: "1 revision included",
  },
];

export type Addon = {
  id: string;
  name: string;
  price: number;
  description: string;
  includes: string[];
  revisions: string;
};

/** Stackable extras — any combination may be added to a session. */
export const ADDONS: Addon[] = [
  {
    id: "full-edit",
    name: "Full Podcast Edit",
    price: 590,
    description:
      "For clients who already have their footage and only need professional post-production.",
    includes: [
      "Full multi-camera edit",
      "Audio cleanup & mixing",
      "Color correction",
      "Basic titles & branding",
      "Professional pacing",
      "YouTube-ready delivery",
    ],
    revisions: "1 revision included",
  },
  {
    id: "3-reels",
    name: "3 Reels",
    price: 700,
    description: "Turn your existing podcast footage into short-form content.",
    includes: [
      "3 professionally edited Reels",
      "Dynamic cuts",
      "Captions",
      "Hook-focused editing",
      "9:16 formatting",
      "Social-media ready delivery",
    ],
    revisions: "1 revision included",
  },
];

/** Sessions in a given category, in display order. */
export const sessionsIn = (category: SessionCategory) =>
  SESSIONS.filter((s) => s.category === category);

/** Display label for a session's booked duration. */
export const durationLabel = (hours: number) =>
  `${hours} Hour${hours === 1 ? "" : "s"}`;

/**
 * Effective hourly rate — what the customer actually pays per hour, so this
 * follows the promotion. Divides the discounted total rather than discounting
 * the original rate: the two agree on every current session, but dividing the
 * real total is the figure that can never disagree with the sum charged.
 */
export const hourlyRate = (s: Session) => Math.round(promoPrice(s.price) / s.hours);

/** The pre-promotion hourly rate, for the struck-through label only. */
export const originalHourlyRate = (s: Session) => Math.round(s.price / s.hours);

/** Lowest studio-only price — the "from" figure quoted across the site. */
export const FROM_PRICE = promoPrice(
  Math.min(...sessionsIn("studio").map((s) => s.price))
);

/** Lowest studio-with-editing price. */
export const FROM_EDITING_PRICE = promoPrice(
  Math.min(...sessionsIn("editing").map((s) => s.price))
);

/**
 * Advertised "from" rate for 8h+ bookings. Quoted by the sales team and never
 * charged through the flow, so it is a published figure only — but it is still
 * published, so it goes through promoPrice() at the call site like every other
 * number on the site rather than sitting at a hardcoded discount.
 */
export const ENTERPRISE_HOURLY_RATE = 420;

/** Cheapest and dearest published sessions — the schema.org priceRange bounds. */
export const PRICE_FLOOR = promoPrice(Math.min(...SESSIONS.map((s) => s.price)));
export const PRICE_CEILING = promoPrice(Math.max(...SESSIONS.map((s) => s.price)));

/** Currency prefix — kept here so no component hardcodes it. */
export const CURRENCY = "AED";

/** Formats a number the way every price on the site is displayed. */
export const formatPrice = (n: number) => `${CURRENCY} ${n.toLocaleString("en-US")}`;

