# Podflix — Website Project Brief

## Brand
- **Name:** Podflix
- **Tagline:** "Every Story... Starts Here"
- **Services:** Studio · Production · Editing
- **Type:** Professional podcast recording studio & content production platform — Dubai
- **Audience:** Content creators, businesses, and individuals wanting professional podcast experiences

## What Podflix offers
- Fully equipped studio rental
- Video production
- Post-production / editing
- Customized sets and professional filming equipment
- End-to-end: concept → recording → final published episode

## Stack
- Next.js 16 (App Router, src/ dir, TypeScript)
- Tailwind CSS v4 (CSS-first config)
- Framer Motion — ALL animation (page transitions, scroll reveals, hover states, micro-interactions)
- Lenis — smooth scroll
- Deploy: Vercel

## Brand Colors (exact — already configured in globals.css)
| Token | Hex | Use |
|-------|-----|-----|
| background | #0A0807 | Main page background |
| surface | #111009 | Cards, elevated surfaces |
| gold | #A98F74 | Primary accent — warm gold/tan |
| gold-muted | #5D513E | Secondary brown accent |
| cream | #EBE0D6 | Headings, light text on dark |
| cream-soft | #E2D1BF | Secondary light text |
| teal | #23333B | Contrast sections |
| text-primary | #EBE0D6 | Body text |
| text-muted | #A98F74 | Secondary/muted text |
| border | #1E1A16 | Borders |

## Typography (already configured in layout.tsx)
- **Display / Headings:** Plus Jakarta Sans (font-display) — geometric, bold, clean
- **Body:** Alexandria (font-body) — modern, readable

## Motion & Design Direction — CRITICAL
The site must feel premium, cinematic, and ahead of its time — like a high-end Dubai production house, not a generic template. Motion is not decorative, it is core to the experience.

- **Aesthetic:** Warm, dark, cinematic — NOT cold/neon/tech. Think moody studio lighting, leather armchairs, soft gold tones.
- **Hero:** Always full viewport height with animated background (subtle pulsing gradient or drifting lines — never static)
- **Scroll reveals:** Every section uses AnimatedSection / AnimatedItem (already built). fade + slide up, staggered for lists.
- **Hover states:** Every interactive element (buttons, cards, nav links) has a motion hover — scale, glow, lift, or underline slide
- **Page transitions:** Smooth, not jarring
- **Gold (#A98F74) is the accent** — used for CTAs, borders, highlights, hover states. bg-gold as a full background only for the final CTA section.
- **Performance:** All animations must be GPU-accelerated (transform/opacity only). Respect prefers-reduced-motion.
- **Mobile:** Reduce particle/parallax intensity on mobile. Layout must be fully responsive.

## Pages (6 total)
1. **Home** — Hero, How It Works, Studio Teaser, Services, Social Proof, Pricing Teaser, Final CTA
2. **Studio** — Page hero, Gallery, Equipment list, What's included, Booking CTA
3. **Pricing** — Page hero, 3 pricing cards, Comparison table, FAQ teaser, CTA
4. **Booking** — Page hero, embedded booking widget placeholder (Simplybook.me — to be wired later)
5. **About / Contact** — Studio story, Contact section, WhatsApp CTA, Map placeholder
6. **FAQ** — Animated accordion, 10+ questions

## Booking & Payments
- Third-party booking SaaS: Simplybook.me (to be embedded Week 2)
- Stripe already connected on client's account
- No custom booking engine — embed widget only
- WhatsApp click-to-chat as fallback on all pages (floating button, bottom-right)

## Shared Components (already built)
- Navbar — transparent → blur on scroll, gold underline hover, animated mobile menu
- Footer — looping gold gradient top border, 3 columns, WhatsApp + Instagram links
- SmoothScrollProvider — Lenis wrapping the app
- AnimatedSection — fade + slide up on whileInView, respects reduced-motion
- AnimatedItem — stagger child for lists inside AnimatedSection
- brand.ts — TAGLINE, SERVICES, SERVICES_LINE, BRAND_NAME, LOGO_SRC, NAV_LINKS

## Content Status
ALL copy and images are PLACEHOLDER until real assets are delivered (Week 2).
Use clearly marked [PLACEHOLDER] text — no invented specific claims.
Real studio photos will replace placeholder divs (aspect-video gradient blocks).

## Out of Scope
- Custom booking engine
- Custom payment processing
- User accounts / login
- CMS integration

## Deadline
July 29, 2026
