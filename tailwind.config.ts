import type { Config } from "tailwindcss";

/**
 * Podflix brand configuration.
 * Loaded by Tailwind v4 via the `@config` directive in src/app/globals.css.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        background: "#0A0807", // primary black — main bg
        surface: "#111009", // slightly lifted dark surface for cards
        // Accents
        gold: {
          DEFAULT: "#A98F74", // primary accent — warm gold/tan
          muted: "#5D513E", // secondary brown accent
        },
        // Light text tones
        cream: {
          DEFAULT: "#EBE0D6", // light text / headings on dark bg
          soft: "#E2D1BF", // secondary light cream
        },
        // Contrast section
        teal: "#23333B", // secondary dark teal — use for contrast sections
        // Semantic text
        text: {
          primary: "#EBE0D6",
          muted: "#A98F74",
        },
        // Borders
        border: "#1E1A16",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
