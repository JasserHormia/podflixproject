import type { Metadata } from "next";
import StudioEntrance from "@/components/studio/StudioEntrance";
import StudioStatement from "@/components/studio/StudioStatement";
import StudioEquipment from "@/components/studio/StudioEquipment";
import StudioGallery from "@/components/studio/StudioGallery";
import StudioIncluded from "@/components/studio/StudioIncluded";
import StudioClose from "@/components/studio/StudioClose";

export const metadata: Metadata = {
  title: "The Studio",
  description:
    "Dubai's premier podcast production studio. Cinema-grade cameras, Shure SM7B mics, soundproofed room, and end-to-end production — every session includes full equipment access.",
};

export default function StudioPage() {
  return (
    <>
      <StudioEntrance />
      <StudioStatement />
      <StudioEquipment />
      <StudioGallery />
      <StudioIncluded />
      <StudioClose />
    </>
  );
}
