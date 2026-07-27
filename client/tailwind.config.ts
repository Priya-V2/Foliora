import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",

        success: "#10B981",

        warning: "#F59E0B",

        danger: "#EF4444",

        background: "#F8FAFC",

        surface: "#FFFFFF",

        surfaceAlt: "#EEF2FF",

        text: "#0F172A",

        textMuted: "#64748B",

        border: "#E2E8F0",
      },

      borderRadius: {
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },

      // fontFamily: {
      //   sans: ["Plus Jakarta Sans", "sans-serif"],
      //   mono: ["Geist Mono", "monospace"],
      // },

      container: {
        center: true,
        padding: "1rem",
        screens: {
          xl: "1280px",
        },
      },

      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
        elevated: "0 8px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
