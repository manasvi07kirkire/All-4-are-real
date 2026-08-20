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
        bone: {
          100: "#F4EDE1",
          300: "#D6CBB8",
          500: "#A2937C",
          700: "#6E6353",
        },
        ember: {
          600: "#C23F10",
          500: "#E8531C",
          400: "#F26A2E",
          tint: "#2A150C",
        },
        marigold: {
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
        paper: {
          50: "#F6F0E6",
          100: "#EDE4D5",
          200: "#E0D4C0",
        },
        espresso: {
          900: "#1B1510",
          700: "#453A2E",
        },
      },
      borderRadius: {
        sm: "3px",
        md: "5px",
        lg: "8px",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        ui: ["var(--font-hanken)", "Hanken Grotesk", "Carlito", "sans-serif"],
        mono: ["var(--font-mono)", "Commit Mono", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        cta: "0 0 0 1px #C23F10, 0 6px 20px rgba(232,83,28,0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
