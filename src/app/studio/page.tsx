import type { Metadata } from "next";
import { SITE_URL } from "@/lib/schema";
import StudioEntrance from "@/components/studio/StudioEntrance";
import StudioStatement from "@/components/studio/StudioStatement";
import StudioEquipment from "@/components/studio/StudioEquipment";
import StudioSetups from "@/components/studio/StudioSetups";
import StudioIncluded from "@/components/studio/StudioIncluded";
import StudioClose from "@/components/studio/StudioClose";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/studio` },
  title: "The Studio",
  description:
    "Dubai podcast studio with Solo, Duo and Quattro setups, three cinema-grade cameras and Shure mics. Every session includes full equipment access and a videographer.",
};

export default function StudioPage() {
  return (
    <>
      <StudioEntrance />
      <StudioStatement />
      <StudioEquipment />
      <StudioSetups />
      <StudioIncluded />
      <StudioClose />
    </>
  );
}
