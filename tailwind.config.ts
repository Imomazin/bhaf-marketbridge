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
          700: "#1f4435",
          800: "#0f2620",
          900: "#072018",
          950: "#03110b",
        },
        gold: {
          50: "#fcf6e6",
          100: "#f6e7b8",
          200: "#edd07c",
          300: "#e6bd45",
          400: "#dba128",
          500: "#bf8410",
          600: "#9f6a0d",
          700: "#7d5410",
          800: "#664315",
          900: "#553818",
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
