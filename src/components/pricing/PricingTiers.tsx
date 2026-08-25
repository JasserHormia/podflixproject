import CategoryPanel from "@/components/pricing/CategoryPanel";
import IMAGES from "@/lib/images";
import { sessionsIn } from "@/lib/booking";

/**
 * Panel 3 — the three product groups, each a full-bleed section. Driven off
 * `category` in booking.ts so the pricing page and the booking flow cannot
 * drift apart.
 */
export default function PricingTiers() {
  return (
    <>
      <CategoryPanel
        index="01"
        eyebrow="Raw Footage"
        title="Studio Only"
        subtitle="The space. The gear. The videographer. You bring the ideas."
        sessions={sessionsIn("studio")}
        image={IMAGES.solo_3}
        alt="Solo lounge podcast set with boom microphone and floor lamp — Podflix Studio, Business Bay Dubai"
        tone="surface"
        imageSide="right"
      />
      <CategoryPanel
        index="02"
        eyebrow="Record + Edit"
        title="Studio + Editing"
        subtitle="Record it. Edit it. Publish it."
        sessions={sessionsIn("editing")}
        image={IMAGES.duo_1}
        alt="Duo interview podcast set with two warm lounge armchairs — Podflix Studio Dubai"
        tone="gold"
        imageSide="left"
      />
      <CategoryPanel
        index="03"
        eyebrow="Signature & Reels"
        title="Packages"
        subtitle="Our most creative work, and short-form built to travel."
        sessions={sessionsIn("package")}
        image={IMAGES.quattro_2}
        alt="Four-person panel podcast set with four lounge armchairs — Podflix Studio Dubai"
        tone="teal"
        imageSide="right"
      />
    </>
  );
}
