import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#080909",
        ink: "#111313",
        paper: "#f2f0e8",
        acid: "#d7ff3f",
        muted: "#a6a79f",
      },
      fontFamily: {
        display: ["SF Pro Display", "Aptos Display", "Segoe UI Variable Display", "system-ui", "sans-serif"],
        body: ["SF Pro Text", "SF Pro Display", "Aptos", "Segoe UI", "system-ui", "sans-serif"],
        editorial: ["PP Editorial New", "Georgia", "Times New Roman", "serif"],
        mono: ["SF Mono", "JetBrains Mono", "Cascadia Code", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 60px rgb(215 255 63 / 0.14)",
        soft: "0 30px 100px rgb(0 0 0 / 0.32)",
      },
    },
  },
  plugins: [],
} satisfies Config;
