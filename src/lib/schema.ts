/**
 * Schema.org structured data.
 *
 * Serialised with the `<` escape Next.js recommends for inline JSON-LD, so a
 * value containing markup can never break out of the <script> element.
 * See node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
 */

export const SITE_URL = "https://podflixpodcast.ae";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Podflix",
  url: SITE_URL,
  telephone: "+971565343070",
  // Matches src/lib/booking.ts exactly: the cheapest session is Studio
  // Recording at AED 590, the dearest is Signature + 3 Reels at AED 3800.
  priceRange: "AED 590 - AED 3800",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday",
    ],
    opens: "09:00",
    closes: "22:00",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tamani Arts Building, 9th Floor, Studio 902",
    addressLocality: "Business Bay",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
} as const;

/** Escapes `<` so the payload is safe to inline in a <script> tag. */
export const jsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
