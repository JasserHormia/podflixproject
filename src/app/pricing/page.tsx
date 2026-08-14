import type { Metadata } from "next";
import PricingEntrance from "@/components/pricing/PricingEntrance";
import PricingPhilosophy from "@/components/pricing/PricingPhilosophy";
import PricingTiers from "@/components/pricing/PricingTiers";
import AlwaysIncluded from "@/components/pricing/AlwaysIncluded";
import PricingFaq from "@/components/pricing/PricingFaq";
import PricingClose from "@/components/pricing/PricingClose";

export const metadata: Metadata = {
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
      <AlwaysIncluded />
      <PricingFaq />
      <PricingClose />
    </>
  );
}
