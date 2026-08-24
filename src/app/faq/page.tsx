import type { Metadata } from "next";
import { SITE_URL } from "@/lib/schema";
import FaqEntrance from "@/components/faq/FaqEntrance";
import FaqExplorer from "@/components/faq/FaqExplorer";
import FaqContact from "@/components/faq/FaqContact";
import FaqClose from "@/components/faq/FaqClose";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/faq` },
  title: "FAQ",
  description:
    "Got questions? Answers on booking, the studio, and production at Podflix, Dubai — and if we don't have one, we'll pick up the phone.",
};

export default function FaqPage() {
  return (
    <>
      <FaqEntrance />
      <FaqExplorer />
      <FaqContact />
      <FaqClose />
    </>
  );
}
