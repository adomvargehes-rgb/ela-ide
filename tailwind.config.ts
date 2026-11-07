import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ide: {
          bg: "#181818",
          sidebar: "#181818",
          activity: "#141414",
          editor: "#1E1E1E",
          header: "#181818",
          status: "#181818",
          border: "#303030",
          hover: "#262626",
          active: "#2A2D32",
          highlight: "#3B82F6",
          accent: "#3B82F6",
          tab: "#181818",
          tabActive: "#1E1E1E",
          text: "#D4D4D4",
          textMuted: "#858585",
          panel: "#181818",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "Fira Code", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

