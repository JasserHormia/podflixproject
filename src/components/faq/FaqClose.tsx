"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import IMAGES from "@/lib/images";
import TextWipe from "@/components/ui/TextWipe";
import MagneticButton from "@/components/ui/MagneticButton";

const PAGE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Booking", href: "/booking" },
  { label: "About", href: "/about" },
];

export default function FaqClose() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <Image
        src={IMAGES.quattro_1}
        alt=""
        fill
        sizes="100vw"
        quality={85}
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0" style={{ background: "rgba(10,8,7,0.88)" }} />

      <div className="relative z-10 px-6 text-center">
        <TextWipe
          as="h2"
          text={["Ready to stop wondering", "and start recording?"]}
          className="font-display text-[clamp(40px,6vw,80px)] font-black leading-[0.85] tracking-[-0.02em] text-cream"
        />

        <motion.p
          className="mt-8 text-sm uppercase tracking-[0.3em] text-gold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.4 }}
        >
          The studio is ready when you are.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.55 }}
        >
          <MagneticButton
            href="/booking"
            className="inline-block rounded-none bg-gold px-10 py-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors duration-300 hover:bg-cream"
          >
            Book Your Session
          </MagneticButton>
        </motion.div>

        {/* Footer-alternative link row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-cream/20">
          {PAGE_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
              {i < PAGE_LINKS.length - 1 && <span aria-hidden>·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
