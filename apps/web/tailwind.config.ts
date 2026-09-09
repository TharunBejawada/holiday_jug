import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcfb",
          100: "#d4f6f3",
          400: "#22b8ac",
          500: "#0f9c91",
          600: "#0b7d75",
          700: "#0a625c",
          900: "#0a3d3a",
        },
        sun: {
          400: "#ffb347",
          500: "#ff9f1c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
