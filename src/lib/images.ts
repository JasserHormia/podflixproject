/**
 * Site-wide image sources.
 *
 * PLACEHOLDERS: Unsplash Source URLs (free, royalty-free, no attribution
 * required) used until real studio photography is delivered. When the real
 * assets arrive they'll live in /public/assets/images/ — swap the values here
 * (e.g. "/assets/images/hero-mic.jpg") and every consumer updates at once.
 *
 * Format: https://images.unsplash.com/photo-[ID]?w=[width]&q=85&auto=format&fit=crop
 */

const IMAGES = {
  // Hero / large format
  hero_mic: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1920&q=85&auto=format&fit=crop", // dramatic close-up mic, dark bg
  hero_studio: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=85&auto=format&fit=crop", // dark recording studio overview
  hero_recording: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=85&auto=format&fit=crop", // person recording, moody

  // Gallery / showroom (mix of orientations)
  gallery_1: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=1200&q=85&auto=format&fit=crop", // mic on stand — client asked for 1559523161-… but it's STILL retired by Unsplash (404), so kept this working shot
  gallery_2: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&q=85&auto=format&fit=crop", // person at mic, moody lighting
  gallery_3: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=85&auto=format&fit=crop", // microphone close-up warm light
  gallery_4: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&q=85&auto=format&fit=crop", // headphones on desk
  gallery_5: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=85&auto=format&fit=crop", // studio mixing board
  gallery_6: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=85&auto=format&fit=crop", // two people recording interview

  // Smaller / card format
  card_mic: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=600&q=85&auto=format&fit=crop", // mic on stand
  card_studio: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=85&auto=format&fit=crop", // dark recording studio w/ equipment (NB: same photo as hero_studio)
  card_session: "https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=600&q=85&auto=format&fit=crop", // recording session — client asked for 1585399000684-… but it's STILL retired by Unsplash (404), so kept this working shot
} as const;

export type ImageKey = keyof typeof IMAGES;
export default IMAGES;

/** Path to the hero background reel (already placed in /public). */
export const HERO_VIDEO = "/assets/videos/studio-reel.mp4";
