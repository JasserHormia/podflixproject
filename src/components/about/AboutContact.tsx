"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import { PHOTOS } from "@/lib/images";
import { SOCIAL } from "@/lib/brand";
import TextWipe from "@/components/ui/TextWipe";

/**
 * Instagram is the only social account that exists, so it is the only one
 * listed. The TW and YT entries that used to sit here pointed at twitter.com
 * and youtube.com — the platforms' own front pages, not profiles — which is
 * worse than no link at all.
 *
 * A list of one is deliberate: adding a real handle later is a single line,
 * and the label style matches the footer's "Instagram →" so the site has one
 * social convention rather than two.
 */
const SOCIALS = [{ label: "Instagram →", href: SOCIAL.instagram }];

export default function AboutContact() {
  const reduce = useReducedMotion();

  return (
    <section className="grid min-h-[80vh] grid-cols-1 md:grid-cols-2">
      {/* LEFT — contact details */}
      <motion.div
        className="flex flex-col justify-center bg-surface p-10 md:p-16"
        initial={reduce ? false : { opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
      >
        <TextWipe
          as="h2"
          text="Let's talk."
          className="font-display text-[clamp(48px,6vw,80px)] font-black leading-[0.85] tracking-[-0.02em] text-cream"
        />
        <p className="mt-6 max-w-sm font-body text-lg text-cream/50">
          Whether you&apos;re ready to book or just exploring — we&apos;d love to hear
          from you.
        </p>

        <div className="mt-12">
          {/* WhatsApp */}
          <div className="flex items-center justify-between border-b border-cream/10 py-6">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/40">WhatsApp</span>
            <a
              href="https://wa.me/971565343070"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-display text-base font-semibold text-gold transition-transform duration-300 hover:translate-x-1"
            >
              +971 56 534 3070
            </a>
          </div>

          {/* Email — flex-wrap, and the only row that needs it. The address is
              a single unbreakable 232px token, so below ~360px it cannot share
              a line with the label: it used to run past the divider to the
              screen edge. Wrapping is self-adjusting, so the one-line layout at
              390px and up is untouched. gap-x-4 also matches Location/Hours,
              which this row was alone in missing. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-cream/10 py-6">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/40">Email</span>
            <a
              href="mailto:bookings@podflixpodcast.ae"
              className="group relative inline-flex min-h-11 items-center font-display text-base font-semibold text-gold"
            >
              bookings@podflixpodcast.ae
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100"
              />
            </a>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between gap-4 border-b border-cream/10 py-6">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/40">Location</span>
            <span className="text-right font-body text-cream/60">
              Tamani Arts Building, Business Bay, Dubai
              <br />
              9th Floor, Studio 902
            </span>
          </div>

          {/* Hours */}
          <div className="flex items-center justify-between gap-4 border-b border-cream/10 py-6">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/40">Hours</span>
            <span className="text-right font-body text-cream/60">
              Mon – Sun · 9:00 AM – 10:00 PM
            </span>
          </div>
        </div>

        {/* Socials — one link, so it is written out rather than abbreviated.
            "IG" only read as a label beside "TW" and "YT"; alone it reads as a
            fragment. min-w-11 and justify-center go with them: they existed to
            square up two-character labels, and a spelled-out link is already
            far wider than 44px and belongs on the same left edge as every
            other row in this column. */}
        <div className="mt-12 flex gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.2em] text-cream/30 transition-colors hover:text-gold"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Map — dark-tinted to match the brand */}
        <div className="relative mt-8 w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4141.700257548858!2d55.27626159678958!3d25.187301600000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69268414659b%3A0x57b0c10714f75064!2sTamani%20arts%20building!5e1!3m2!1sfr!2sae!4v1784847184191!5m2!1sfr!2sae"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(90%)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Podflix Studio Location"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <a
          href="https://maps.google.com/?q=Tamani+Arts+Building+Business+Bay+Dubai"
          target="_blank"
          rel="noopener"
          className="group relative mt-4 inline-flex min-h-11 items-center font-display text-sm text-gold"
        >
          Get Directions →
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100"
          />
        </a>
      </motion.div>

      {/* RIGHT — image */}
      <motion.div
        className="relative min-h-[50vh] md:min-h-full"
        initial={reduce ? false : { opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
      >
        <Image
          src={PHOTOS.detail_microphone}
          alt="Close-up of a Shure broadcast microphone on a boom arm above the studio table — Podflix Studio Dubai"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={85}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(17,16,9,0.4) 0%, rgba(17,16,9,0) 55%)",
          }}
        />
      </motion.div>
    </section>
  );
}
