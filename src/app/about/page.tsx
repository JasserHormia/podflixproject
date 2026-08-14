import type { Metadata } from "next";
import AboutManifesto from "@/components/about/AboutManifesto";
import AboutStory from "@/components/about/AboutStory";
import AboutNumbers from "@/components/about/AboutNumbers";
import AboutSpace from "@/components/about/AboutSpace";
import AboutTeam from "@/components/about/AboutTeam";
import AboutContact from "@/components/about/AboutContact";
import AboutClose from "@/components/about/AboutClose";

// The root "%s | Podflix" template renders this as "About | Podflix".
export const metadata: Metadata = {
  title: "About",
  description:
    "Podflix is Dubai's premier podcast studio — built for creators who believe every story is worth telling well. Studio, production, and editing under one roof.",
};

export default function AboutPage() {
  return (
    <>
      <AboutManifesto />
      <AboutStory />
      <AboutNumbers />
      <AboutSpace />
      <AboutTeam />
      <AboutContact />
      <AboutClose />
    </>
  );
}
