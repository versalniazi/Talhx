import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        ink: {
          950: "#04060d",
          900: "#070b17",
          850: "#0a1020",
          800: "#0e1529",
          700: "#161f3a",
          600: "#222d4f",
          500: "#3a4670",
        },
        volt: {
          50: "#eef3ff",
          100: "#dce6ff",
          200: "#b9ccff",
          300: "#8eabff",
          400: "#6489ff",
          500: "#3f6bff",
          600: "#2b52eb",
          700: "#2140c4",
        },
        iris: {
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        mist: "#f5f7fb",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: { tightest: "-0.045em" },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,137,255,0.25), 0 20px 60px -20px rgba(63,107,255,0.45)",
        card: "0 1px 2px rgba(7,11,23,0.04), 0 12px 32px -12px rgba(7,11,23,0.12)",
        "card-hover": "0 1px 2px rgba(7,11,23,0.06), 0 24px 48px -16px rgba(7,11,23,0.22)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(120deg, #3f6bff 0%, #8b5cf6 100%)",
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(400%)" } },
        grow: { "0%": { transform: "scaleX(0)" }, "100%": { transform: "scaleX(1)" } },
        typing: { "0%": { width: "0" }, "40%,90%": { width: "100%" }, "100%": { width: "0" } },
        blink: { "50%": { opacity: "0" } },
        "pop-in": { "0%": { opacity: "0", transform: "scale(0.6)" }, "100%": { opacity: "1", transform: "scale(1)" } },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 40s linear infinite",
        scan: "scan 4s ease-in-out infinite",
        grow: "grow 1.2s cubic-bezier(0.22,1,0.36,1) both",
        typing: "typing 7s steps(28) infinite",
        blink: "blink 1s step-end infinite",
        "pop-in": "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
      },
    },
  },
  plugins: [typography],
};

export default config;
