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

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/pricing` },
  title: "Pricing & Packages",
  description:
    "Invest in your voice. Three ways into Dubai's premier podcast studio — Single Session, Creator Pack, and Pro Bundle. Every session includes full equipment access.",
};

export default function PricingPage() {
  return (
    <>
      <PricingEntrance />
      <PricingPhilosophy />
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
