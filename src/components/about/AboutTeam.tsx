"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EXPO } from "@/lib/motion";
import TextWipe from "@/components/ui/TextWipe";

// Same inline noise grain used on the studio page.
const NOISE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/></svg>`
);
const grainStyle = {
  backgroundImage: `url("data:image/svg+xml,${NOISE}")`,
  backgroundSize: "120px 120px",
};

const TEAM = [
  {
    name: "[PLACEHOLDER NAME]",
    role: "[PLACEHOLDER ROLE]",
    line: "[PLACEHOLDER — one powerful sentence about them.]",
  },
  {
    name: "[PLACEHOLDER NAME]",
    role: "[PLACEHOLDER ROLE]",
    line: "[PLACEHOLDER — one powerful sentence about them.]",
  },
  {
    name: "[PLACEHOLDER NAME]",
    role: "[PLACEHOLDER ROLE]",
    line: "[PLACEHOLDER — one powerful sentence about them.]",
  },
];

export default function AboutTeam() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
  };

  return (
    <section className="bg-background px-8 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <TextWipe
          as="h2"
          text="Behind the Studio."
          className="font-display text-5xl font-black text-cream md:text-7xl"
        />
        <p className="mt-4 text-sm uppercase tracking-[0.3em] text-gold">
          A team obsessed with one thing: your content.
        </p>

        <motion.div
          className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {TEAM.map((member, i) => (
            <motion.div key={i} variants={item}>
              <motion.div
                whileHover={reduce ? undefined : { scale: 1.03, borderColor: "rgba(169,143,116,0.6)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative flex aspect-square max-w-[280px] items-center justify-center overflow-hidden border border-border bg-surface"
              >
                <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={grainStyle} />
                <span className="relative text-sm text-cream/20">[Team Photo]</span>
              </motion.div>
              <p className="mt-4 font-display text-xl font-semibold text-cream">
                {member.name}
              </p>
              <p className="text-sm uppercase tracking-[0.2em] text-gold">{member.role}</p>
              <p className="mt-2 max-w-[280px] font-body text-sm text-cream/40">
                {member.line}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
