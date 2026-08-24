import type { Metadata } from "next";
import { SITE_URL } from "@/lib/schema";
import Arrival from "@/components/home/Arrival";
import TheNumber from "@/components/home/TheNumber";
import TheProcess from "@/components/home/TheProcess";
import TheShowroom from "@/components/home/TheShowroom";
import TheBroadcast from "@/components/home/TheBroadcast";
import ThePricingSlam from "@/components/home/ThePricingSlam";
import TheClose from "@/components/home/TheClose";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}` },
  // `absolute` bypasses the "%s | Podflix" template for the home title.
  title: { absolute: "Podflix | Every Story Starts Here" },
};

export default function Home() {
  return (
    <>
      <Arrival />
      <TheNumber />
      <TheProcess />
      <TheShowroom />
      <TheBroadcast />
      <ThePricingSlam />
      <TheClose />
    </>
  );
}
