import CategoryStudioRental from "@/components/pricing/CategoryStudioRental";
import CategoryProduction from "@/components/pricing/CategoryProduction";
import CategoryReels from "@/components/pricing/CategoryReels";

/** Panel 3 — the three distinct product categories, each a full-bleed section. */
export default function PricingTiers() {
  return (
    <>
      <CategoryStudioRental />
      <CategoryProduction />
      <CategoryReels />
    </>
  );
}
