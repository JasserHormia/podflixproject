"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  BRAND_NAME,
  LOGO_SRC,
  NAV_LINKS,
  SERVICES_LINE,
  SOCIAL,
  TAGLINE,
} from "@/lib/brand";

const SERVICES = [
  "Studio Booking",
  "Video Production",
  "Post-Production",
  "Content Strategy",
];

const CONNECT = [
  { label: "WhatsApp →", href: SOCIAL.whatsapp, external: true },
  { label: "Instagram →", href: SOCIAL.instagram, external: true },
  { label: "Email →", href: "mailto:hello@podflix.ae", external: false },
];

const COL_HEADING = "mb-6 text-[9px] uppercase tracking-[0.4em] text-cream/30";

export default function Footer() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  // The homepage ends with its own full-screen "Close" panel, which replaces
  // the footer there. Render nothing on home.
  if (pathname === "/") return null;

  return (
    <AnimatedSection as="footer" className="relative bg-background">
      {/* Top: animated gold gradient line sweeping across the full width */}
      <motion.div
        aria-hidden
        className="h-0.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #A98F74 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        initial={false}
        animate={reduce ? undefined : { backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      />

      {/* ── TOP SECTION ── */}
      <div className="grid grid-cols-1 gap-12 px-8 py-20 md:grid-cols-[60fr_40fr] md:px-16">
        <div>
          <Link href="/" aria-label={`${BRAND_NAME} home`} className="inline-block">
            <Image
              src={LOGO_SRC}
              alt="Podflix"
              width={200}
              height={60}
              priority
              className="max-w-full object-contain object-left"
            />
          </Link>
          <p className="mt-6 font-body text-base italic text-cream/30">{TAGLINE}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gold/40">
            {SERVICES_LINE}
          </p>
        </div>

        <div className="flex flex-col md:items-end md:text-right">
          <h2 className="font-display text-3xl font-black leading-[0.85] text-cream md:text-4xl">
            Ready to record?
          </h2>
          <div className="mt-6">
            <MagneticButton
              href="/booking"
              className="inline-block rounded-none bg-gold px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-background transition-colors duration-300 hover:bg-cream"
            >
              Book a Session →
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION ── */}
      <div className="grid grid-cols-2 gap-8 border-t border-cream/10 px-8 py-12 md:grid-cols-4 md:px-16">
        {/* Navigate */}
        <div>
          <p className={COL_HEADING}>Navigate</p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-1 font-body text-sm text-cream/50 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Services */}
        <div>
          <p className={COL_HEADING}>Services</p>
          {SERVICES.map((service) => (
            <p key={service} className="py-1 font-body text-sm text-cream/50">
              {service}
            </p>
          ))}
        </div>

        {/* Connect */}
        <div>
          <p className={COL_HEADING}>Connect</p>
          {CONNECT.map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="block py-1 font-body text-sm text-gold transition-colors hover:text-cream"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Location */}
        <div>
          <p className={COL_HEADING}>Location</p>
          <p className="text-sm text-cream/50">Tamani Arts Building</p>
          <p className="mt-1 text-xs text-cream/30">Business Bay, Dubai · 9th Floor, Studio 902</p>
          <p className="mt-3 text-xs text-cream/30">Mon – Sun · 9:00 AM – 10:00 PM</p>
          <p className="mt-1 text-xs text-cream/20">GST (UTC+4)</p>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/10 px-8 py-6 sm:flex-row md:px-16">
        <p className="font-body text-xs text-cream/20">
          © 2026 {BRAND_NAME}. All rights reserved.
        </p>

        {/* Heartbeat line */}
        <motion.span
          aria-hidden
          className="h-px w-15 bg-gold/30"
          initial={false}
          animate={reduce ? undefined : { opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        />

        <span className="cursor-default font-body text-xs text-cream/20 transition-colors hover:text-gold">
          Crafted by MCFLIX Agency
        </span>
      </div>
    </AnimatedSection>
  );
}
