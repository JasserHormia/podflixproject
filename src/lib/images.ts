/**
 * Site-wide image sources — real Podflix studio photography, delivered by the
 * client and served from /public/assets/setups/.
 *
 * Keys are named after the seat configuration they show (Solo / Duo / Quattro)
 * so slots read semantically at the call site. Every source is landscape 16:9,
 * so any key is safe in any `fill` + `object-cover` slot.
 *
 * The delivered masters were 5504px PNGs (214MB total); they are stored here
 * re-encoded to max-2560px JPEG (~7.8MB total) since nothing on the site
 * renders above 2560 CSS px. next/image resizes down from these.
 *
 * Resolution note: solo_1, solo_2 and solo_4 came in at ~1700px, below the
 * 2560 ceiling. Keep those three out of full-bleed 100vw hero slots.
 */

const IMAGES = {
  // Solo setup
  solo_1: "/assets/setups/solo/solo-01.jpg",
  solo_2: "/assets/setups/solo/solo-02.jpg",
  solo_3: "/assets/setups/solo/solo-03.jpg",
  solo_4: "/assets/setups/solo/solo-04.jpg",
  solo_5: "/assets/setups/solo/solo-05.jpg",
  // Duo setup
  duo_1: "/assets/setups/duo/duo-01.jpg",
  duo_2: "/assets/setups/duo/duo-02.jpg",
  duo_3: "/assets/setups/duo/duo-03.jpg",
  // Quattro setup
  quattro_1: "/assets/setups/quattro/quattro-01.jpg",
  quattro_2: "/assets/setups/quattro/quattro-02.jpg",
  // NOTE: quattro-03 was delivered byte-identical to quattro-02. The key is
  // kept so slots assigned to it keep working, but the two are deliberately
  // never shown in the same view. Pending a replacement frame from the client.
  quattro_3: "/assets/setups/quattro/quattro-03.jpg",
} as const;

export type ImageKey = keyof typeof IMAGES;
export default IMAGES;

/** Hero background reels — desktop is landscape, mobile is the vertical cut. */
export const VIDEOS = {
  hero_desktop: "/assets/videos/hero-desktop.mp4",
  hero_mobile: "/assets/videos/hero-mobile.mp4",
} as const;
