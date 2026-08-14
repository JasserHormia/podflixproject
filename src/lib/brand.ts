/**
 * Podflix brand constants — reused across pages so copy stays consistent.
 */

export const BRAND_NAME = "Podflix";

/** Primary brand tagline. */
export const TAGLINE = "Every Story... Starts Here";

/** Split form of the tagline for staggered / two-part display. */
export const TAGLINE_PARTS = {
  lead: "Every Story...",
  trail: "Starts Here",
} as const;

/** Core services offered. */
export const SERVICES = ["Studio", "Production", "Editing"] as const;

/** Services joined with the brand's middot separator, e.g. "Studio · Production · Editing". */
export const SERVICES_LINE = SERVICES.join(" · ");

export type Service = (typeof SERVICES)[number];

/**
 * Primary logo: the full white "PODflix" wordmark (text + tagline).
 * NOTE: the asset filenames are inverted — the "-version" file is the wordmark
 * and the "-wordmark" file is the icon mark. Referenced by Navbar and Footer.
 */
export const LOGO_SRC = "/assets/logos/white-version.png";

/**
 * Icon-only logo mark (the mic/speech-bubble symbol) — for favicon / mobile nav.
 * (This is the "-wordmark" file despite the misleading name.)
 */
export const LOGO_ICON_SRC = "/assets/logos/white-wordmark.png";

/** Primary navigation — shared by Navbar and Footer. */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Booking", href: "/booking" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

/** External / social links — replace placeholders with real handles. */
export const SOCIAL = {
  whatsapp: "https://wa.me/971565343070",
  instagram: "https://instagram.com/PLACEHOLDER",
} as const;

/** Attribution shown in the footer. */
export const POWERED_BY = "Powered by MCFLIX Agency";
