import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        mist: "#f4f7f8",
        field: "#e8f0ef",
        moss: "#5e7d67",
        coral: "#c76556",
        gold: "#c69b42",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 38, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
