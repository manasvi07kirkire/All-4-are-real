import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bone: {
          100: "#F4EDE1",
          300: "#D6CBB8",
          400: "#C4B6A0",
          500: "#A2937C",
          700: "#6E6353",
        },
        ink: {
          900: "#100E0C",
          850: "#15110D",
          800: "#1A1613",
          750: "#221C17",
          700: "#2B241D",
        },
        line: {
          600: "#383027",
          500: "#4A4034",
        },
        ember: {
          600: "#C23F10",
          500: "#E8531C",
          400: "#F26A2E",
          tint: "#2A150C",
        },
        marigold: {
          600: "#B4791F",
          400: "#E7A13A",
          tint: "#241B0D",
        },
        patina: {
          600: "#2E6E62",
          500: "#3E8C7E",
          400: "#4FA695",
          tint: "#0F211E",
        },
        steel: {
          400: "#6E8CA0",
        },
        darkSurface: {
          DEFAULT: "#1A1613",
          code: "#1e1e1e",
          panel: "#1d100c",
          sub: "#2b1c18",
        },
      },
      fontFamily: {
        display: ["'JetBrains Mono'", "monospace"],
        sans: ["'Hanken Grotesk'", "sans-serif"],
        body: ["'Hanken Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "4px",
        xl: "8px",
      },
      boxShadow: {
        cta: "0 2px 12px rgba(194, 63, 16, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
