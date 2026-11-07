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
          bg: "#18181b", // zinc-900 / VS Code dark
          sidebar: "#141416",
          activity: "#0f0f11",
          editor: "#1e1e20",
          header: "#141416",
          status: "#0f0f11",
          border: "#27272a", // zinc-800
          hover: "#2a2a2e",
          active: "#323238",
          highlight: "#3b82f6", // subtle blue
          accent: "#2563eb",
          tab: "#18181b",
          tabActive: "#1e1e20",
          text: "#e4e4e7",
          textMuted: "#a1a1aa",
          panel: "#18181b",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["Consolas", "Fira Code", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
