import CategoryPanel from "@/components/pricing/CategoryPanel";
import IMAGES from "@/lib/images";
import { SESSIONS, sessionsIn } from "@/lib/booking";

// Full Production splits across two panels: the Essential tier, then Signature.
const ESSENTIAL_IDS = ["essential-podcast", "essential-3-reels"];
const SIGNATURE_IDS = ["signature", "signature-3-reels"];
const byIds = (ids: string[]) => SESSIONS.filter((s) => ids.includes(s.id));

/** Panel 3 — the three product tiers, each a full-bleed section. */
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
        alt="The Solo setup — boom microphone over an armchair"
        tone="surface"
        imageSide="right"
      />
      <CategoryPanel
        index="02"
        eyebrow="Record + Edit"
        title="Full Production"
        subtitle="Record it. Edit it. Publish it."
        sessions={byIds(ESSENTIAL_IDS)}
        image={IMAGES.duo_1}
        alt="The Duo setup — two armchairs and boom microphones"
        tone="gold"
        imageSide="left"
      />
      <CategoryPanel
        index="03"
        eyebrow="Premium Production"
        title="Signature"
        subtitle="Our most creative, most refined production experience."
        sessions={byIds(SIGNATURE_IDS)}
        image={IMAGES.quattro_2}
        alt="The Quattro setup — four armchairs arranged for a panel"
        tone="teal"
        imageSide="right"
      />
    </>
  );
}
