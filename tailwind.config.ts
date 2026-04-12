import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // GoJulito custom — theme-aware via CSS variables
        // Accent colors use RGB format for Tailwind opacity modifier support (e.g. bg-gj-green/15)
        gj: {
          bg: "var(--gj-bg)",
          card: "var(--gj-card)",
          input: "var(--gj-input)",
          amber: "rgb(var(--gj-amber) / <alpha-value>)",
          green: "rgb(var(--gj-green) / <alpha-value>)",
          red: "rgb(var(--gj-red) / <alpha-value>)",
          blue: "rgb(var(--gj-blue) / <alpha-value>)",
          text: "var(--gj-text)",
          secondary: "var(--gj-text-secondary)",
          seminario: "rgb(var(--gj-seminario) / <alpha-value>)",
          surface: "var(--gj-surface)",
          "surface-low": "var(--gj-surface-low)",
          "surface-mid": "var(--gj-surface-mid)",
          "surface-high": "var(--gj-surface-high)",
          "surface-highest": "var(--gj-surface-highest)",
          "amber-hv": "rgb(var(--gj-amber-hv) / <alpha-value>)",
          steel: "var(--gj-steel)",
          "steel-light": "var(--gj-steel-light)",
          outline: "var(--gj-outline)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
