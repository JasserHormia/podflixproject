"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TextWipe from "@/components/ui/TextWipe";

type QA = { q: string; a: string };
type Category = { id: string; label: string; questions: QA[] };

/**
 * Client-supplied final copy. Answers are verbatim and must stay that way —
 * the one exception is "How do I book a session at Podflix?", rewritten at the
 * client's instruction now that checkout is self-serve with online payment
 * rather than a WhatsApp payment link.
 *
 * The categories exist only to drive the pills and section headings. They are
 * contiguous slices of the client's list, so reading top to bottom reproduces
 * their original order exactly.
 */
const CATEGORIES: Category[] = [
  {
    id: "general",
    label: "General",
    questions: [
      {
        q: "What is Podflix?",
        a: "Podflix is a premium podcast and video production studio in Dubai, designed for creators, entrepreneurs, brands, and businesses. We combine a high-end studio environment, professional production equipment, and creative expertise to help you produce exceptional podcasts, interviews, and social media content.",
      },
    ],
  },
  {
    id: "booking",
    label: "Booking",
    questions: [
      {
        q: "How far in advance should I book a session?",
        a: "We recommend booking in advance to secure your preferred time slot. However, last-minute bookings are welcome  even 30 minutes before your session, subject to studio availability.",
      },
      {
        q: "Can I reschedule or cancel my session?",
        a: "You can reschedule your session free of charge up to 24 hours before your booking. Rescheduling within 24 hours is subject to a AED 200 fee, which will be deducted from your existing booking credit. For cancellations, please contact our team as early as possible to discuss the applicable booking terms.",
      },
      {
        q: "Is there a minimum booking duration?",
        a: "Yes. The minimum booking duration at Podflix is 1 hour. Additional time can be booked depending on your production requirements and studio availability.",
      },
      {
        q: "Can I book outside regular working hours?",
        a: "Yes. We can accommodate after-hours and overnight productions upon request. Let us know in advance, and our team will coordinate the appropriate setup and staff availability.",
      },
      {
        q: "How many people can join a session?",
        a: "Our studio can accommodate up to 4 people per session, making it ideal for solo podcasts, interviews, and group conversations.",
      },
    ],
  },
  {
    id: "studio",
    label: "Studio",
    questions: [
      {
        q: "What equipment is available at Podflix?",
        a: "Podflix is equipped with high-end professional production equipment, including Sony FX3 cameras, Amaran lighting, Shure microphones, professional lenses, and advanced audio and video equipment. Every element of our setup is selected to deliver premium-quality sound and visuals.",
      },
      {
        q: "Can I bring my own equipment?",
        a: "Yes. You are welcome to bring your own equipment if required. Our team can coordinate with you in advance to ensure everything integrates smoothly with the studio setup.",
      },
      {
        q: "Is the studio soundproofed?",
        a: "Podflix is designed to provide a controlled recording environment suitable for professional podcast and video production, helping you achieve clean, clear, high-quality audio.",
      },
    ],
  },
  {
    id: "production",
    label: "Production",
    questions: [
      {
        q: "Do you offer video production?",
        a: "Yes. Podflix provides professional video production for podcasts, interviews, branded content, social media videos, and other creative productions. Our studio is built to capture both high-quality audio and cinematic visuals.",
      },
      {
        q: "Can you edit my podcast after recording?",
        a: "Yes. We offer packages with or without editing, depending on your needs. Our post-production services can include podcast editing and short-form content creation for platforms such as Instagram, TikTok, and YouTube.",
      },
      {
        q: "Is podcast editing included in my booking?",
        a: "It depends on the package you choose. Some Podflix packages include editing and post-production, while others are studio-only. Our team can recommend the best option based on your content requirements.",
      },
      {
        q: "Can I live stream directly from Podflix?",
        a: "Live streaming is not currently part of our standard services. However, our studio is equipped for professional video production, and we are continuously expanding our production capabilities. For specific streaming requirements, contact our team and we’ll explore what’s possible.",
      },
      {
        q: "What formats do you deliver the final content in?",
        a: "Final content can be prepared in formats optimized for your chosen platform, including horizontal, vertical, and square formats for YouTube, Instagram, TikTok, and other digital platforms.",
      },
      {
        q: "Can I record a video podcast at Podflix?",
        a: "Absolutely. Podflix is a premium video podcast studio in Dubai, offering professional cameras, lighting, microphones, and production setups designed specifically for high-quality podcast and interview content.",
      },
      {
        q: "Do you offer podcast production in Dubai?",
        a: "Yes. Podflix offers professional podcast production in Dubai, including studio recording, video production, editing, and short-form content creation depending on the package selected.",
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    questions: [
      {
        q: "Do you offer recurring podcast bookings?",
        a: "Yes. Creators, businesses, and brands can book recurring sessions for ongoing podcast production and content creation. Recurring bookings are ideal for anyone looking to maintain a consistent content schedule.",
      },
      {
        q: "Can brands and businesses book Podflix?",
        a: "Yes. Podflix works with creators, entrepreneurs, companies, brands, and professionals looking to produce premium podcasts, interviews, branded videos, and social media content.",
      },
      {
        q: "Do you offer social media content creation?",
        a: "Yes. Your podcast recording can be transformed into multiple pieces of content for social media. Depending on your package, we can create short-form videos and other content optimized for Instagram, TikTok, YouTube, and other platforms.",
      },
      {
        q: "What happens if I need an additional revision?",
        a: "Additional revisions are available depending on the service. Extra revisions are charged between AED 100 and AED 200 per revision, depending on the scope of the requested changes.",
      },
      {
        q: "Why choose Podflix as your podcast studio in Dubai?",
        a: "Podflix is built for creators who want more than a basic recording space. From our premium studio environment and high-end production equipment to professional audio, cinematic visuals, and flexible content packages, every detail is designed to help you create content that looks and sounds exceptional.",
      },
      {
        q: "How do I book a session at Podflix?",
        a: "Booking is simple - choose your session on our website, pick your set and time, and pay securely online. You can also reach us on WhatsApp if you'd prefer help choosing the right package.",
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
  total,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  category: string;
  index: number;
  total: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      data-faq-row
      data-category={category}
      data-index={index}
      data-total={total}
      className="border-b border-cream/10"
    >
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
  // Categories are different lengths (1/5/3/7/6), so the denominator has to
  // come from whichever section the reader is actually in.
  const [total, setTotal] = useState(CATEGORIES[0].questions.length);
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
          setTotal(Number(el.dataset.total) || 0);
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
              {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
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
                    total={cat.questions.length}
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
