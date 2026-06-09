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
          background: "#F4EDE1",
          brown: "#4B2E1F",
          gold: "#C9A227",
          cream: "#FFF9EF",
          foam: "#FBF5EA"
        }
      },
      boxShadow: {
        soft: "0 18px 55px rgba(75, 46, 31, 0.14)",
        button: "0 14px 28px rgba(75, 46, 31, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
