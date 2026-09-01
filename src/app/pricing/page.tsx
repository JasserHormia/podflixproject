import type { Metadata } from "next";
import { SITE_URL } from "@/lib/schema";
import PricingEntrance from "@/components/pricing/PricingEntrance";
import PricingPhilosophy from "@/components/pricing/PricingPhilosophy";
import EnterpriseBlock from "@/components/booking/EnterpriseBlock";
import PricingTiers from "@/components/pricing/PricingTiers";
import AlwaysIncluded from "@/components/pricing/AlwaysIncluded";
import PricingAddons from "@/components/pricing/PricingAddons";
import PricingFaq from "@/components/pricing/PricingFaq";
import PricingClose from "@/components/pricing/PricingClose";
import PromoBadge from "@/components/ui/PromoBadge";
import { PROMO_ACTIVE } from "@/lib/promo";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/pricing` },
  title: "Pricing & Packages",
  description:
    "Transparent podcast studio pricing in Dubai. Studio from AED 590/hour, editing from AED 1,190/hour, plus Signature and Reels packages. No hidden fees.",
};

export default function PricingPage() {
  return (
    <>
      <PricingEntrance />
      <PricingPhilosophy />
      {/* Directly above the tiers, so the offer is read before the first
          price. Gated here as well as inside PromoBadge so the band's own
          padding goes with it — otherwise revert would leave an empty strip. */}
      {PROMO_ACTIVE && (
        <section className="bg-background px-6 pt-10 text-center md:px-16">
          <PromoBadge />
        </section>
      )}
      <PricingTiers />
      <section className="bg-background px-6 py-16 md:px-16">
        <div className="mx-auto max-w-5xl">
          <EnterpriseBlock />
        </div>
      </section>
      <AlwaysIncluded />
      <PricingAddons />
      <PricingFaq />
      <PricingClose />
    </>
  );
}
