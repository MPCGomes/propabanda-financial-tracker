import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "text-color": "#282828",
      "primary-color": "#FFA322",
    },
    extend: {},
  },
  plugins: [],
};

export default config;
