"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Constructor injected by SimplyBook's widget script. */
type SimplybookWidgetCtor = new (config: Record<string, unknown>) => unknown;

declare global {
  interface Window {
    SimplybookWidget: SimplybookWidgetCtor;
  }
}

const SCRIPT_SRC = "//widget.simplybook.me/v2/widget/widget.js";

/** Client brand palette, passed through to SimplyBook's theme engine. */
const THEME_SETTINGS = {
  timeline_hide_unavailable: "1",
  hide_past_days: "0",
  timeline_show_end_time: "0",
  timeline_modern_display: "as_slots",
  light_font_color: "#a98f74",
  sb_secondary_base: "#111009",
  sb_base_color: "#a98f74",
  display_item_mode: "block",
  booking_nav_bg_color: "#0a0807",
  sb_review_image: "",
  dark_font_color: "#ebe0d6",
  btn_color_1: "#a98f74",
  sb_company_label_color: "#ebe0d6",
  // 1, not 0 — hides SimplyBook's placeholder plate icons.
  hide_img_mode: "1",
  show_sidebar: "1",
  sb_busy: "#3a342e",
  sb_available: "#a98f74",
} as const;

/**
 * SimplyBook.me official widget.
 *
 * The script is fetched once per page; if the constructor is already on
 * `window` we build directly rather than re-injecting. The container id comes
 * from `useId()` (colons stripped, since they are not valid in CSS selectors)
 * so remounting between steps can never collide with a previous instance.
 */
export default function SimplybookWidget({ sbId }: { sbId: number }) {
  const reduce = useReducedMotion();
  const rawId = useId();
  const containerId = `sb-${rawId.replace(/:/g, "")}`;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = document.getElementById(containerId);

    const build = () => {
      if (cancelled || !window.SimplybookWidget) return;
      new window.SimplybookWidget({
        widget_type: "iframe",
        url: "https://podflixpodcast.simplybook.me",
        theme: "concise",
        theme_settings: THEME_SETTINGS,
        timeline: "modern",
        datepicker: "top_calendar",
        is_rtl: false,
        app_config: {
          clear_session: 0,
          allow_switch_to_ada: 0,
          // Object, NOT an array. Tested against the live tenant: the array
          // forms ([{service}], [id], [{event}]) are silently ignored and drop
          // the customer on SimplyBook's service list. Only the object binds.
          predefined: { service: sbId },
        },
        container_id: containerId,
      });
    };

    // The widget injects an iframe into the container; that is our ready signal.
    let observer: MutationObserver | undefined;
    if (container) {
      // Attached before build() runs below, so it cannot miss the injection.
      observer = new MutationObserver(() => {
        if (!cancelled && container.childElementCount > 0) setReady(true);
      });
      observer.observe(container, { childList: true });
    }

    let script: HTMLScriptElement | undefined;

    if (window.SimplybookWidget) {
      build();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`
      );
      if (existing) {
        existing.addEventListener("load", build);
      } else {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.addEventListener("load", build);
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      // Only remove what is still attached — unmounting twice would throw.
      if (script && script.parentNode === document.head) {
        document.head.removeChild(script);
      }
      // Clear any widget markup so a remount starts from an empty container.
      if (container) container.replaceChildren();
    };
  }, [sbId, containerId]);

  return (
    <div className="relative">
      <div id={containerId} className="min-h-245 w-full md:min-h-205" />

      <AnimatePresence>
        {!ready && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-surface"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gold/15"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-gold"
                strokeDasharray="126"
                animate={reduce ? undefined : { strokeDashoffset: [126, 32, 126] }}
                transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
              />
            </motion.svg>
            <span className="sr-only">Loading availability…</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
