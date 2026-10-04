import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pantera: {
          navy: "#15182B",
          dark: "#0E101D",
          gold: "#E9B737",
          goldHover: "#D4A42C",
          goldLight: "#FDF9ED",
          surface: "#FFFFFF",
          muted: "#6B7280",
          border: "#E2E4EC",
        },
        ink: {
          DEFAULT: "#15182B",
          950: "#0E101D",
          900: "#15182B",
          800: "#1C2038",
          700: "#232742",
        },
        teal: {
          dark: "#15182B",
          tropical: "#E9B737",
          ink: "#0E101D",
          50: "#FDF9ED",
          100: "#F8EECE",
          200: "#F2DEA0",
          300: "#E9B737",
          400: "#D4A42C",
          500: "#E9B737",
          600: "#C29525",
          700: "#232742",
          800: "#1C2038",
          900: "#15182B",
          950: "#0E101D",
        },
        brand: {
          DEFAULT: "#15182B",
          dark: "#0E101D",
          accent: "#E9B737",
          light: "#FDF9ED",
          border: "#E2E4EC",
        },
        indigo: {
          50: "#FDF9ED",
          100: "#F8EECE",
          200: "#F2DEA0",
          300: "#E9B737",
          400: "#D4A42C",
          500: "#E9B737",
          600: "#15182B",
          700: "#1C2038",
          800: "#15182B",
          900: "#0E101D",
          950: "#0E101D",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "Space Grotesk",
          "Inter",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "IBM Plex Mono",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
