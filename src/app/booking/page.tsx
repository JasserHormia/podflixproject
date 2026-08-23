import type { Metadata } from "next";
import BookingMoment from "@/components/booking/BookingMoment";
import BookingFlow from "@/components/booking/BookingFlow";
import BookingGuarantee from "@/components/booking/BookingGuarantee";
import BookingFallback from "@/components/booking/BookingFallback";
import BookingClose from "@/components/booking/BookingClose";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Reserve your studio at Podflix, Dubai. Pick your format, choose your set, and lock your session — instant confirmation, free reschedule up to 24h.",
};

export default function BookingPage() {
  return (
    <>
      <BookingMoment />
      <BookingFlow />
      <BookingGuarantee />
      <BookingFallback />
      <BookingClose />
    </>
  );
}
