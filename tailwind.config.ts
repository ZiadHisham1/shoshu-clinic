import type { Config } from "tailwindcss";

// Alpha-aware channel tokens so `bg-primary/10` works with CSS variables.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
     colors: {
        background: token("background"),
        surface: token("surface"),
        border: token("border"),
        muted: token("muted"),
        foreground: token("foreground"),
        primary: token("primary"),
        "primary-strong": token("primary-strong"),
        accent: token("accent"),

        // Figma tokens
        figma: {
          page:    "#ffe5ec",   // page background
          header:  "#fb6f92",   // header/navbar bar
          cta:     "#ff8fab",   // header CTA button
          tab:     "#ffc2d1",   // default tab bg
          tabOn:   "#ffbaba",   // active tab bg
          card:    "#ffb3c6",   // booking CTA card
          text:    "#3f3f3f",   // main dark text
          textMut: "#747474",   // muted text
          footer:  "#ef7c7c",   // footer logo color
          divider: "#8b8b8b",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "9999px",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lifted: "var(--shadow-lifted)",
      },
     fontFamily: {
        sans:     ["var(--font-cairo)",     "system-ui", "sans-serif"],
        tajawal:  ["var(--font-tajawal)",   "system-ui", "sans-serif"],
        sacramento: ["var(--font-sacramento)", "cursive"],
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 6s ease infinite",
      },
      backgroundSize: {
        "300": "300% 300%",
      },
    },
  },
  plugins: [],
};

export default config;
