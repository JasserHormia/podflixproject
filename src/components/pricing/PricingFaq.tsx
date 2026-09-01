"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ADDONS, formatPrice } from "@/lib/booking";
import { promoPrice } from "@/lib/promo";

/** Read from ADDONS so the answer cannot contradict the cards further up the
 *  same page — it previously said 590/700 while they showed 413/490. */
const addon = (id: string) => {
  const a = ADDONS.find((x) => x.id === id)!;
  return `${a.name} for ${formatPrice(promoPrice(a.price))}`;
};

const FAQS = [
  {
    q: "Can I add reel edits to any package?",
    a: `Yes — add a ${addon("full-edit")} or ${addon("3-reels")} to any session. Both can be added together.`,
  },
  {
    q: "Is the studio operator included?",
    a: "Yes, a professional studio operator is included in every session at no extra cost.",
  },
  {
    q: "What does 'raw footage delivery' mean?",
    a: "You receive all unedited footage from your session — multi-camera, full resolution, ready for your own editor or ours.",
  },
  {
    q: "What are the themed studio sets?",
    a: "Podflix offers 12 distinct set designs across three formats — Solo, Duo, and Quattro. Switch freely between themes during your session.",
  },
  {
    q: "How do I book and pay?",
    a: "Booking is simple - choose your session on our website, pick your set and time, and pay securely online. You can also reach us on WhatsApp if you'd prefer help choosing the right package.",
  },
  {
    q: "Can I reschedule or cancel my session?",
    // Kept word-for-word identical to the same question on /faq — two pages
    // stating the same policy differently is how policies drift.
    a: "You can reschedule your session free of charge up to 24 hours before your booking. Rescheduling within 24 hours is subject to a AED 200 fee, which will be deducted from your existing booking credit. For cancellations, please contact our team as early as possible to discuss the applicable booking terms.",
  },
  {
    q: "Can I book for more than 5 hours?",
    a: "Absolutely — contact us via WhatsApp for custom full-day or multi-day rates.",
  },
  {
    q: "What's included in the 4K export?",
    a: "All deliverables are exported in 4K resolution with cinematic color grading, audio enhancement, and platform-optimized formatting.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      aria-hidden
      className="h-5 w-5 shrink-0 text-gold"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

export default function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section className="bg-background px-8 py-24 md:px-16">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
        {/* Left — sticky */}
        <div className="md:sticky md:top-1/3">
          <h2 className="font-display text-5xl font-black leading-tight text-cream md:text-7xl">
            Questions?
          </h2>
        </div>

        {/* Right — accordion */}
        <div>
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className="border-b border-cream/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="font-display text-xl font-semibold text-cream">
                    {faq.q}
                  </span>
                  <Chevron open={isOpen} />
                </button>

                {/* Height 0 → auto (measured by Framer), not a display toggle. */}
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 font-body text-base leading-relaxed text-cream/60">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
