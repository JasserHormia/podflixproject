"use client";

import { useId } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useIsTouch } from "@/lib/useIsTouch";

/**
 * Circular text ring using SVG <textPath>, rotating on a loop, with a static
 * icon in the center (the ring rotates, the icon does not). Reduced-motion
 * renders it stationary.
 */
export default function CircularText({
  text,
  size = 160,
  duration = 20,
  icon = "/assets/logos/camel-version.png",
  className = "",
}: {
  text: string;
  size?: number;
  duration?: number;
  icon?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();
  const pathId = useId();

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0"
        animate={reduce || isTouch ? undefined : { rotate: 360 }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <path
              id={pathId}
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              fill="none"
            />
          </defs>
          <text
            style={{
              fill: "#a98f74",
              fontSize: "7px",
              letterSpacing: "1.5px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            <textPath href={`#${pathId}`}>{text}</textPath>
          </text>
        </svg>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <Image src={icon} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
      </div>
    </div>
  );
}
