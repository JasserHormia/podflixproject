import type { Metadata } from "next";
import StudioEntrance from "@/components/studio/StudioEntrance";
import StudioStatement from "@/components/studio/StudioStatement";
import StudioEquipment from "@/components/studio/StudioEquipment";
import StudioSetups from "@/components/studio/StudioSetups";
import StudioIncluded from "@/components/studio/StudioIncluded";
import StudioClose from "@/components/studio/StudioClose";

export const metadata: Metadata = {
  title: "The Studio",
  description:
    "Dubai's premier podcast production studio. Solo, Duo and Quattro setups, cinema-grade cameras, Shure SM7B mics, and end-to-end production — every session includes full equipment access.",
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
