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
          // light, airy coffee-shop palette
          background: "#FBF9F6",
          wood: "#FFFFFF",
          walnut: "#FFFFFF",
          bark: "#F3EEE4",
          brown: "#2B2117", // primary text on light background
          gold: "#B8863E",
          goldLight: "#D9A855",
          cream: "#F5EBD8",
          foam: "#FFFFFF"
        }
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Tahoma", "system-ui", "sans-serif"],
        display: ["var(--font-vazirmatn)", "Tahoma", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(43, 33, 23, 0.08)",
        button: "0 10px 20px rgba(184, 134, 62, 0.25)",
        gold: "0 0 0 1px rgba(184, 134, 62, 0.35), 0 8px 18px rgba(184, 134, 62, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
