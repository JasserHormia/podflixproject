"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TextWipe from "@/components/ui/TextWipe";

type QA = { q: string; a: string };
type Category = { id: string; label: string; questions: QA[] };

const CATEGORIES: Category[] = [
  {
    id: "booking",
    label: "Booking",
    questions: [
      {
        q: "How far in advance should I book?",
        a: "[PLACEHOLDER — A few days ahead is ideal, but same-week slots open up often. Booking online takes under a minute.]",
      },
      {
        q: "Can I reschedule or cancel my session?",
        a: "[PLACEHOLDER — Reschedule free up to 24 hours before. Within 24 hours an AED 200 fee applies as booking credit; cancellations are case by case.]",
      },
      {
        q: "Is there a minimum booking duration?",
        a: "[PLACEHOLDER — One hour is the minimum. Most sessions run longer once the ideas start flowing.]",
      },
      {
        q: "Can I book the studio for a full day?",
        a: "Yes. Full-day and multi-day bookings start at AED 420 per hour for 8 hours or more. Message us on WhatsApp with your requirements and we'll put together a custom quote.",
      },
      {
        q: "Do you offer recurring booking packages?",
        a: "[PLACEHOLDER — Absolutely. The Creator Pack bundles hours at a better rate for regulars.]",
      },
    ],
  },
  {
    id: "studio",
    label: "Studio",
    questions: [
      {
        q: "What equipment is available in the studio?",
        a: "[PLACEHOLDER — Up to four Shure microphones, three Sony FX3 cinema cameras, a Rodecaster Pro II, and Amaran lighting — all included.]",
      },
      {
        q: "How many people can join a session?",
        a: "[PLACEHOLDER — Up to four guests, each on their own microphone.]",
      },
      {
        q: "Can I bring my own equipment?",
        a: "[PLACEHOLDER — Of course. Bring whatever you like — our setup is here whenever you need it.]",
      },
      {
        q: "Is the studio soundproofed?",
        a: "[PLACEHOLDER — The room is acoustically treated for a controlled recording environment.]",
      },
    ],
  },
  {
    id: "production",
    label: "Production",
    questions: [
      {
        q: "Do you offer video production?",
        a: "[PLACEHOLDER — Yes — three-camera video on Sony FX3 bodies for a true cinematic look.]",
      },
      {
        q: "Can you edit my podcast after recording?",
        a: "[PLACEHOLDER — We do. Post-production and editing are available as an add-on or in the Pro Bundle.]",
      },
      {
        q: "Can I live stream directly from the studio?",
        a: "[PLACEHOLDER — Live streaming is not currently offered.]",
      },
      {
        q: "What formats do you deliver the final content in?",
        a: "[PLACEHOLDER — Broadcast-ready audio and video in whatever formats your platforms need.]",
      },
    ],
  },
];

const PILLS = [{ id: "all", label: "All" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))];

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

function AccordionRow({
  category,
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  category: string;
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div data-faq-row data-category={category} data-index={index} className="border-b border-cream/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-7 text-left"
      >
        <span className="font-display text-xl font-semibold text-cream">{question}</span>
        <Chevron open={isOpen} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="overflow-hidden"
      >
        <p className="max-w-2xl pb-7 font-body text-base leading-relaxed text-cream/50">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function FaqExplorer() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [current, setCurrent] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  // Track the question nearest the top of the viewport → drives both the pill
  // highlight and the sticky counter. setState runs inside the observer
  // callback (async), never synchronously in the effect body.
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-faq-row]"));
    if (rows.length === 0) return;

    const visible = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
          else visible.delete(entry.target as HTMLElement);
        }
        // Choose the topmost currently-visible row.
        let top: HTMLElement | null = null;
        let min = Infinity;
        visible.forEach((el) => {
          const t = el.getBoundingClientRect().top;
          if (t < min) {
            min = t;
            top = el;
          }
        });
        if (top) {
          const el = top as HTMLElement;
          setActiveCategory(el.dataset.category ?? "all");
          setCurrent(Number(el.dataset.index) || 1);
        }
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: 0 }
    );

    rows.forEach((r) => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const targetId = id === "all" ? CATEGORIES[0].id : id;
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveCategory(id);
  };

  const stickyLabel = activeCategory === "all" ? "FAQ" : activeCategory;

  return (
    <section className="bg-background">
      {/* Sticky category pills */}
      <div className="sticky top-16 z-30 border-y border-cream/5 bg-background/80 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-6">
          {PILLS.map((pill) => {
            const active = activeCategory === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => scrollTo(pill.id)}
                className={`rounded-none border px-6 py-3 font-display text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active
                    ? "border-gold bg-gold text-background"
                    : "border-cream/20 text-cream/40 hover:border-gold hover:bg-gold hover:text-background"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-column questions */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-8 py-20 md:grid-cols-[35fr_65fr] md:gap-16 md:px-16">
        {/* Left — sticky navigational label + counter (desktop only) */}
        <div className="hidden md:block">
          <div className="md:sticky md:top-1/3">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/40">{stickyLabel}</p>
            <span aria-hidden className="my-6 block h-16 w-px bg-gold/30" />
            <p className="font-display text-xs text-cream/20">
              {String(current).padStart(2, "0")} / 04
            </p>
          </div>
        </div>

        {/* Right — categorized accordions */}
        <div>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} id={cat.id} className="mb-20 scroll-mt-28 last:mb-0">
              <TextWipe
                as="h2"
                text={cat.label}
                className="mb-12 font-display text-4xl font-black text-cream md:text-5xl"
              />
              {cat.questions.map((qa, i) => {
                const rowId = `${cat.id}-${i}`;
                return (
                  <AccordionRow
                    key={rowId}
                    category={cat.id}
                    index={i + 1}
                    question={qa.q}
                    answer={qa.a}
                    isOpen={openId === rowId}
                    onToggle={() => setOpenId(openId === rowId ? null : rowId)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
