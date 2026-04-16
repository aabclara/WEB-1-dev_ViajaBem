import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
      colors: {
        /* --- Core Palette (from reference template) --- */
        primary: "#ffa914",
        "on-primary": "#ffffff",
        "primary-container": "#ffa915",

        secondary: "#0DBDC2",
        "on-secondary": "#ffffff",
        "secondary-container": "#fecc8d",

        tertiary: "#53ed72",
        "tertiary-container": "#00cbff",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",

        /* --- Surfaces --- */
        background: "#F7F2E8",
        "on-background": "#1F1F1F",
        surface: "#F7F2E8",
        "on-surface": "#1F1F1F",
        "on-surface-variant": "#534433",
        "surface-variant": "#efe0d1",
        "surface-dim": "#e7d8c9",
        "surface-bright": "#F7F2E8",
        "surface-container": "#fbebdc",
        "surface-container-low": "#fff1e5",
        "surface-container-high": "#f5e6d7",
        "surface-container-highest": "#efe0d1",
        "surface-container-lowest": "#ffffff",

        /* --- Outlines --- */
        outline: "#857461",
        "outline-variant": "#d8c3ad",

        /* --- Inverse --- */
        "inverse-surface": "#231c0f",
        "inverse-on-surface": "#feeedf",
        "inverse-primary": "#ffb958",

        /* --- Legacy aliases (keep backward compat) --- */
        "viaje-primary": "#FFA914",
        "viaje-secondary": "#97703A",
        "viaje-tertiary": "#00CBFF",
        "viaje-neutral": "#817569",
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
    },
  },
  plugins: [],
};
export default config;
