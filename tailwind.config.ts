import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f1f6f3",
          100: "#dceae1",
          200: "#bcd5c5",
          300: "#8fb6a1",
          400: "#62937c",
          500: "#447761",
          600: "#345f4d",
          700: "#244638",
          800: "#16302a",
          900: "#0b2820",
          950: "#061711",
        },
        gold: {
          50: "#fbf7ec",
          100: "#f4ecca",
          200: "#ead794",
          300: "#dfbe5e",
          400: "#d4a73a",
          500: "#c08e26",
          600: "#a3711e",
          700: "#80561c",
          800: "#69441c",
          900: "#593a1d",
        },
        cream: {
          50: "#fbf9f3",
          100: "#f5f1e6",
          200: "#ece4cf",
          300: "#dccfae",
        },
        charcoal: {
          50: "#f4f4f4",
          100: "#e4e4e4",
          200: "#c4c4c4",
          300: "#a0a0a0",
          400: "#717171",
          500: "#4d4d4d",
          600: "#333333",
          700: "#262626",
          800: "#1a1a1a",
          900: "#111111",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgba(11, 40, 32, 0.18)",
        card: "0 1px 2px rgba(11, 40, 32, 0.04), 0 8px 24px -12px rgba(11, 40, 32, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
