"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const FAQS = [
  {
    q: "Can I add reel edits to any package?",
    a: "Yes — add 3 edited reels to any booking for AED 900. Just let us know when booking via WhatsApp.",
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
    q: "What are the 4 premium studio sets?",
    a: "Podflix offers multiple set configurations — Solo, Duo, and Quattro — switch freely between them during your session.",
  },
  {
    q: "How do I book and pay?",
    a: "Book online, select your package, and we'll send a secure payment link via WhatsApp. Powered by Network International.",
  },
  {
    q: "Is there a cancellation policy?",
    a: "Free cancellation up to 24 hours before your session. Within 24 hours, a 50% fee applies.",
  },
  {
    q: "Can I book for more than 12 hours?",
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
