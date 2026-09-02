/**
 * Site-wide image sources — real Podflix studio photography, delivered by the
 * client and served from /public/assets/setups/.
 *
 * Keys are named after the format they show — Solo (1 seat), Duo (2), Quattro
 * (4) — so slots read semantically at the call site. Each format has several
 * themed set designs, and there is one frame per theme: 7 Solo + 3 Duo + 2
 * Quattro = the 12 themed sets quoted in the site copy. Every source is
 * landscape 16:9, so any key is safe in any `fill` + `object-cover` slot.
 *
 * The delivered masters were 5504px PNGs (214MB total); they are stored here
 * re-encoded to max-2560px JPEG (~7.8MB total) since nothing on the site
 * renders above 2560 CSS px. next/image resizes down from these.
 *
 * Resolution note: solo_1, solo_2 and solo_4 came in at ~1700px, below the
 * 2560 ceiling. Keep those three out of full-bleed 100vw hero slots.
 */

const IMAGES = {
  // Solo — 7 themes
  solo_1: "/assets/setups/solo/solo-01.jpg",
  solo_2: "/assets/setups/solo/solo-02.jpg",
  solo_3: "/assets/setups/solo/solo-03.jpg",
  solo_4: "/assets/setups/solo/solo-04.jpg",
  solo_4b: "/assets/setups/solo/solo-04b.jpg",
  solo_5: "/assets/setups/solo/solo-05.jpg",
  solo_5b: "/assets/setups/solo/solo-05b.jpg",
  // Duo — 3 themes
  duo_1: "/assets/setups/duo/duo-01.jpg",
  duo_2: "/assets/setups/duo/duo-02.jpg",
  duo_3: "/assets/setups/duo/duo-03.jpg",
  // Quattro — 2 themes
  quattro_1: "/assets/setups/quattro/quattro-01.jpg",
  quattro_2: "/assets/setups/quattro/quattro-02.jpg",
  // NOTE: quattro-03 was delivered byte-identical to quattro-02, which lines up
  // with Quattro having only 2 themes. The key is kept so slots assigned to it
  // keep working, but the two are never shown in the same view.
  quattro_3: "/assets/setups/quattro/quattro-03.jpg",
} as const;

/**
 * Editorial photography — the studio in use, the production room, the crew,
 * and detail shots.
 *
 * Deliberately a separate object from IMAGES. Those 13 frames are bound
 * one-to-one to the themed sets a customer picks by name in the booking flow,
 * and their count is quoted in site copy ("12 Themed Sets"), so swapping one
 * would show someone a room they are not booking. These carry no such
 * contract — they fill decorative slots only.
 *
 * Sources were 105MB of PNG masters; re-encoded to WebP at 2400px (hero) or
 * 1600px (supporting) for 1.2MB total, since nothing renders above 2400 CSS px.
 */
export const PHOTOS = {
  /* Sets — cinematic room shots */
  studio_navy_duo: "/assets/photos/studio-navy-duo-armchairs.webp",
  studio_cream_duo: "/assets/photos/studio-cream-duo-boucle.webp",
  studio_cream_quattro: "/assets/photos/studio-cream-quattro.webp",
  /* Production & post */
  production_room: "/assets/photos/production-room-desk.webp",
  production_editor: "/assets/photos/production-editor-premiere.webp",
  production_crew: "/assets/photos/production-crew-clapperboard.webp",
  /* Details — all portrait, for the tall slots */
  detail_microphone: "/assets/photos/detail-shure-microphone.webp",
  detail_lamp: "/assets/photos/detail-brass-lamp-sculpture.webp",
  detail_bookshelf: "/assets/photos/detail-bookshelf-dubai.webp",
  /* The studio in use */
  guest_amber: "/assets/photos/guest-host-recording-amber.webp",
  guest_kandura: "/assets/photos/guest-kandura-navy-set.webp",
  guest_blazer: "/assets/photos/guest-host-white-blazer.webp",
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export type ImageKey = keyof typeof IMAGES;
export default IMAGES;

/** Hero background reels — desktop is landscape, mobile is the vertical cut. */
export const VIDEOS = {
  hero_desktop: "/assets/videos/hero-desktop.mp4",
  hero_mobile: "/assets/videos/hero-mobile.mp4",
  /** First-frame stills, so the hero is never a black gap while the reel loads. */
  hero_desktop_poster: "/assets/videos/hero-desktop-poster.jpg",
  hero_mobile_poster: "/assets/videos/hero-mobile-poster.jpg",
} as const;
