import type { Metadata } from "next";
import BookingMoment from "@/components/booking/BookingMoment";
import BookingHowTo from "@/components/booking/BookingHowTo";
import BookingWidget from "@/components/booking/BookingWidget";
import BookingGuarantee from "@/components/booking/BookingGuarantee";
import BookingFallback from "@/components/booking/BookingFallback";
import BookingClose from "@/components/booking/BookingClose";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Reserve your studio at Podflix, Dubai. Choose your session, pick your date, and show up — we handle everything else. Instant confirmation, free cancellation up to 24h.",
};

export default function BookingPage() {
  return (
    <>
      <BookingMoment />
      <BookingHowTo />
      <BookingWidget />
      <BookingGuarantee />
      <BookingFallback />
      <BookingClose />
    </>
  );
}
