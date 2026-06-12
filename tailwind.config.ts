import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          // dark walnut wood palette
          background: "#1A0E07",
          wood: "#2A170D",
          walnut: "#3A1F11",
          bark: "#4B2A18",
          brown: "#F1D8A6", // now used as primary *text* on dark wood
          gold: "#D4A24A",
          goldLight: "#E8C275",
          cream: "#F3E1B7",
          foam: "#FBF5EA"
        }
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Tahoma", "system-ui", "sans-serif"],
        display: ["var(--font-gulzar)", "var(--font-vazirmatn)", "serif"]
      },
      boxShadow: {
        soft: "0 18px 55px rgba(0, 0, 0, 0.45)",
        button: "0 14px 28px rgba(0, 0, 0, 0.55)",
        gold: "0 0 0 1px rgba(212, 162, 74, 0.55), 0 10px 24px rgba(212, 162, 74, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
