"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A button/link that leans toward the cursor while hovered, then springs back.
 * Offset is proportional to the pointer's distance from the element's center,
 * capped at ±`max` px. Renders inert under reduced-motion.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  max = 15,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Offset from center, scaled so the edge maps to ±max.
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / (rect.width / 2)) * max);
    y.set((relY / (rect.height / 2)) * max);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const content = href ? (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );

  if (reduce) return <span className="inline-block">{content}</span>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {content}
    </motion.div>
  );
}
