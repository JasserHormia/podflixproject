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

export type SessionCategory = "studio" | "production";

export type Session = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  category: SessionCategory;
  /** SimplyBook.me service id — deep-links the embed straight to its calendar. */
  sbId: number;
  description: string;
  includes: string[];
  /** Null where the session ships no edit, so no revision policy applies. */
  revisions: string | null;
  /** Secondary line under the price, e.g. an effective hourly rate. */
  priceNote?: string;
  recommended?: boolean;
};

/**
 * Final client pricing. Sessions are fixed-price products — there is no hourly
 * ladder any more, so nothing should derive a price by multiplying hours.
 */
export const SESSIONS: Session[] = [
  {
    id: "studio-recording",
    name: "Studio Recording",
    tagline: "Just record. We take care of the rest.",
    price: 590,
    duration: "1 Hour",
    category: "studio",
    sbId: 2,
    description:
      "A fully equipped premium podcast studio for creators, entrepreneurs, brands and businesses who want professional-quality footage and audio.",
    includes: [
      "1 hour studio access",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Professional studio lighting",
      "Fully equipped podcast setup",
      "Dedicated videographer on set",
      "Technical assistance throughout",
      "Raw video & audio footage available for 14 days",
    ],
    revisions: null,
  },
  {
    id: "essential-podcast",
    name: "Essential Podcast",
    tagline: "Record. Edit. Publish.",
    price: 1090,
    duration: "1 Hour",
    category: "production",
    sbId: 3,
    description:
      "A complete podcast recording and editing experience for a professional, polished final episode.",
    includes: [
      "1 hour studio recording",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio recording",
      "Professional lighting",
      "Dedicated videographer",
      "Multi-camera synchronization",
      "Full podcast episode edit",
      "Clean cuts & professional pacing",
      "Audio cleanup & mixing",
      "Color correction",
      "Basic titles & branding",
      "YouTube-ready final episode",
    ],
    revisions: "1 revision included",
  },
  {
    id: "essential-3-reels",
    name: "Essential + 3 Reels",
    tagline: "One recording. One full episode. Three pieces of content.",
    price: 1750,
    duration: "1 Hour",
    category: "production",
    sbId: 4,
    description:
      "Everything you need to turn one podcast recording into long-form and short-form content.",
    includes: [
      "Everything in Essential Podcast",
      "3 edited Reels",
      "Multi-camera synchronization",
      "Audio cleanup & mixing",
      "Color correction",
      "Basic titles & branding",
      "YouTube-ready final episode",
    ],
    revisions: "1 revision included",
  },
  {
    id: "signature",
    name: "Podflix Signature",
    tagline: "Our premium production experience.",
    price: 2500,
    duration: "1 Hour",
    category: "production",
    sbId: 5,
    description:
      "A highly creative, visually refined podcast production designed for creators, brands and personalities who want their episode to stand out.",
    includes: [
      "1 hour premium studio recording",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional lighting",
      "Dedicated videographer",
      "Advanced multi-camera editing",
      "Advanced color grading",
      "Creative transitions",
      "Dynamic pacing",
      "Professional sound design",
      "B-roll integration where appropriate",
      "Advanced titles & graphics",
      "Custom visual treatment",
      "Premium audio mastering",
      "YouTube-ready final episode",
    ],
    revisions: "2 revisions included",
  },
  {
    id: "signature-3-reels",
    name: "Podflix Signature + 3 Reels",
    tagline: "The complete Podflix experience.",
    price: 3800,
    duration: "1 Hour",
    category: "production",
    sbId: 6,
    recommended: true,
    description:
      "Our highest-level production package: a signature podcast episode transformed into premium long-form and short-form content.",
    includes: [
      "Everything in Podflix Signature",
      "3 Signature Reels",
      "Advanced short-form editing",
      "Cinematic visual treatment",
      "Dynamic transitions",
      "Advanced color grading",
      "Sound design",
      "Captions",
      "Motion graphics where appropriate",
      "9:16 social-media optimization",
      "Instagram / TikTok / YouTube Shorts ready",
    ],
    revisions: "2 revisions included",
  },
  {
    id: "studio-5hr",
    name: "5-Hour Studio Package",
    tagline: "Batch your content. Save time.",
    price: 2500,
    duration: "5 Hours",
    category: "studio",
    sbId: 7,
    priceNote: "AED 500/hour",
    description:
      "For creators, brands and podcasts that want to record multiple episodes or content pieces in one booking.",
    includes: [
      "5 hours of studio recording",
      "3 × Sony FX3 cameras",
      "Up to 4 × Shure microphones",
      "Professional audio mixer",
      "Professional lighting",
      "Dedicated videographer",
      "Fully equipped podcast setup",
      "Choice of available setup",
      "Raw video & audio footage available for 14 days",
    ],
    revisions: "Editing not included",
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

/** Lowest session price — the "from" figure quoted across the site. */
export const FROM_PRICE = Math.min(...SESSIONS.map((s) => s.price));

/** Lowest full-production price, quoted separately from studio-only. */
export const FROM_PRODUCTION_PRICE = Math.min(
  ...sessionsIn("production").map((s) => s.price)
);

/** SimplyBook.me tenant. The booking embed deep-links into this host. */
export const SB_BASE = "https://podflixpodcast.simplybook.me";

/** Currency prefix — kept here so no component hardcodes it. */
export const CURRENCY = "AED";

/** Formats a number the way every price on the site is displayed. */
export const formatPrice = (n: number) => `${CURRENCY} ${n.toLocaleString("en-US")}`;

/* ── Booking summary ─────────────────────────────────────────────────── */

/** Everything chosen in the flow, in display-ready form. */
export type BookingSummary = {
  people: number | null;
  format: string;
  set: string;
  session: string;
  addons: { name: string; price: number }[];
  total: number;
};

/**
 * WhatsApp handoff link carrying the full selection. Kept here rather than in
 * the flow so the booking card can build it without prop-drilling.
 */
export const whatsappBookingHref = (s: BookingSummary, whatsappUrl: string) => {
  const body = [
    "New Booking Request — Podflix",
    `People: ${s.people ?? "—"}`,
    `Format: ${s.format}`,
    `Set: ${s.set}`,
    `Session: ${s.session}`,
    `Add-ons: ${
      s.addons.length
        ? s.addons.map((a) => `${a.name} +${formatPrice(a.price)}`).join(", ")
        : "none"
    }`,
    `Total: ${formatPrice(s.total)}`,
  ].join("\n");
  return `${whatsappUrl}?text=${encodeURIComponent(body)}`;
};
