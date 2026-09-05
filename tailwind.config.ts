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
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
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
        sans: ["'Inter'", "'Hanken Grotesk'", "sans-serif"],
        body: ["'Inter'", "'Hanken Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        grotesk: ["'Hanken Grotesk'", "sans-serif"],
      },
      fontSize: {
        /* Enforce readability floor */
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],      /* 11px - eyebrows only */
        xs: ["0.75rem", { lineHeight: "1.125rem" }],  /* 12px - minimum labels */
        sm: ["0.875rem", { lineHeight: "1.375rem" }],  /* 14px - body/descriptions */
        base: ["1rem", { lineHeight: "1.6rem" }],    /* 16px - card headings */
        lg: ["1.125rem", { lineHeight: "1.75rem" }],   /* 18px - section headings */
        xl: ["1.25rem", { lineHeight: "1.875rem" }],  /* 20px - sub-titles */
        "2xl": ["1.5rem", { lineHeight: "2rem" }],      /* 24px */
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],  /* 30px */
        "4xl": ["2.25rem", { lineHeight: "2.75rem" }],   /* 36px */
        "5xl": ["3rem", { lineHeight: "3.5rem" }],    /* 48px - gauge scores */
        "6xl": ["3.75rem", { lineHeight: "4.25rem" }],   /* 60px - hero gauge scores */
        "7xl": ["4.5rem", { lineHeight: "5rem" }],      /* 72px - display metrics */
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "4px",
        xl: "8px",
        "2xl": "12px",
      },
      boxShadow: {
        cta: "0 2px 12px rgba(194, 63, 16, 0.35)",
        card: "0 1px 3px rgba(16, 14, 12, 0.08), 0 1px 2px rgba(16, 14, 12, 0.04)",
        "card-hover": "0 4px 12px rgba(16, 14, 12, 0.12)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
      },
      minHeight: {
        touch: "44px", /* iOS HIG minimum tap target */
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
