import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#050608",
          900: "#090A0F",
          850: "#0E1017",
          800: "#141722",
          700: "#1E2233",
          600: "#2B3047",
        },
        gold: {
          50: "#FFFDF0",
          100: "#FFF7D6",
          200: "#FFEBA0",
          300: "#FBE06B",
          400: "#F5D03A",
          500: "#D4AF37", // Primary Nobre Gold
          600: "#B8860B", // Dark Metallic Gold
          700: "#996515", // Deep Gold
          800: "#6B430B",
          900: "#3D2505",
          950: "#1E1202",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFF7D6 0%, #E6C265 40%, #B8860B 80%, #D4AF37 100%)",
        "gold-gradient-dark": "linear-gradient(135deg, #D4AF37 0%, #996515 50%, #2C220E 100%)",
        "gold-gradient-btn": "linear-gradient(135deg, #E6C265 0%, #D4AF37 35%, #B8860B 75%, #996515 100%)",
        "obsidian-radial": "radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(9, 10, 15, 0.95) 70%)",
        "glass-radial": "radial-gradient(ellipse at top, rgba(212, 175, 55, 0.12), transparent 60%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.3)",
        "gold-glow-lg": "0 0 50px -10px rgba(212, 175, 55, 0.4)",
        "gold-glow-sm": "0 0 12px 0 rgba(212, 175, 55, 0.25)",
        "obsidian-card": "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
        "lift": "0 10px 30px -12px rgba(255, 255, 255, 0.18)",
        "lift-lg": "0 20px 40px -20px rgba(255, 255, 255, 0.14)",
        "winner-glow": "0 0 0 1px rgba(255, 255, 255, 0.4), 0 20px 45px -15px rgba(255, 255, 255, 0.25)",
        "winner-glow-gold": "0 0 0 1px rgba(212, 175, 55, 0.5), 0 20px 45px -15px rgba(212, 175, 55, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gold-shine": "goldShine 3s infinite linear",
      },
      keyframes: {
        goldShine: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
