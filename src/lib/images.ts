/**
 * Site-wide image sources — Unsplash placeholders until real studio photos land.
 *
 * All URLs below were verified (HTTP 200) AND visually confirmed to be on-brand
 * podcast/studio/mic content. 5 slots from the requested set were unusable —
 * hero_recording & gallery_2 returned 404, and gallery_5 (gaming rig),
 * gallery_6 & card_session (dice in neon) were off-brand — so those were filled
 * from the verified on-brand pool instead.
 */

const IMAGES = {
  // Hero / large format
  hero_mic: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1920&q=85&auto=format&fit=crop", // studio mic on stand
  hero_studio: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=85&auto=format&fit=crop", // condenser mic, moody
  hero_recording: "https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?w=1920&q=85&auto=format&fit=crop", // person recording (was 404 → on-brand fallback)

  // Gallery / showroom
  gallery_1: "https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?w=1200&q=85&auto=format&fit=crop", // person recording
  gallery_2: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&q=85&auto=format&fit=crop", // studio mic (was 404 → on-brand fallback)
  gallery_3: "https://images.unsplash.com/photo-1519874179391-3ebc752241dd?w=800&q=85&auto=format&fit=crop", // mic close-up, warm light
  gallery_4: "https://images.unsplash.com/photo-1567596388756-f6d710c8fc07?w=1200&q=85&auto=format&fit=crop", // mic + headphones
  gallery_5: "https://images.unsplash.com/photo-1519874179391-3ebc752241dd?w=800&q=85&auto=format&fit=crop", // mic close-up (was gaming rig → on-brand fallback)
  gallery_6: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=85&auto=format&fit=crop", // condenser mic (was dice → on-brand fallback)

  // Smaller / card format
  card_mic: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=85&auto=format&fit=crop", // studio mic
  card_studio: "https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?w=600&q=85&auto=format&fit=crop", // person recording
  card_session: "https://images.unsplash.com/photo-1567596388756-f6d710c8fc07?w=600&q=85&auto=format&fit=crop", // mic + headphones (was dice → on-brand fallback)
} as const;

export type ImageKey = keyof typeof IMAGES;
export default IMAGES;

/** Path to the hero background reel (already placed in /public). */
export const HERO_VIDEO = "/assets/videos/studio-reel.mp4";
