import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      colors: {
        // Core background and surface tokens (Deep Matte Charcoal / Slate)
        background: {
          DEFAULT: "#1A1D20",
          deep: "#141618",
          subtle: "#1F2327",
        },
        surface: {
          DEFAULT: "#262A2E",
          card: "#262A2E",
          elevated: "#2D3237",
          hover: "#343940",
          border: "#3B424A",
          muted: "#212428",
        },
        // Warm Amber / Orange Accent tokens
        accent: {
          DEFAULT: "#E46438",
          hover: "#D05327",
          active: "#B84119",
          glow: "rgba(228, 100, 56, 0.4)",
          subtle: "rgba(228, 100, 56, 0.12)",
          ring: "rgba(228, 100, 56, 0.5)",
          light: "#F97316",
        },
        // Typography & status colors
        content: {
          primary: "#F8FAFC",
          secondary: "#CBD5E1",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
        status: {
          scheduled: "#38BDF8",
          enroute: "#FBBF24",
          inprogress: "#E46438",
          completed: "#34D399",
          cancelled: "#F87171",
        },
        border: "#33383F",
        input: "#2A2E33",
        ring: "#E46438",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        "4.5": "1.125rem",  // 18px
        "5.5": "1.375rem",  // 22px
        "6.5": "1.625rem",  // 26px
        "7.5": "1.875rem",  // 30px
        "13": "3.25rem",    // 52px
        "18": "4.5rem",     // 72px
        "22": "5.5rem",     // 88px
        "26": "6.5rem",     // 104px
        "30": "7.5rem",     // 120px
      },
      borderRadius: {
        pill: "9999px",
        card: "14px",
        cardLg: "18px",
        btn: "9999px",
        modal: "20px",
        badge: "8px",
      },
      boxShadow: {
        "elevation-sticky": "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(255, 255, 255, 0.05)",
        "elevation-card": "0 12px 28px -8px rgba(0, 0, 0, 0.55), 0 1px 1px rgba(255, 255, 255, 0.04) inset",
        "elevation-card-hover": "0 20px 40px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(228, 100, 56, 0.15)",
        "elevation-modal": "0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        "accent-glow": "0 0 24px rgba(228, 100, 56, 0.35)",
        "accent-glow-lg": "0 0 45px rgba(228, 100, 56, 0.5)",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        "float-gentle": "float-gentle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
