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
          100: "#F7EFCF",
          200: "#D6BD85",
          300: "#C2A25B",
          400: "#C2A25B",
          500: "#A47E35", // Primary Nobre Gold (#a47e35)
          600: "#A47E35",
          700: "#8B6828", // Deep Gold
          800: "#73541E",
          900: "#3D2A0A",
          950: "#1E1404",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #a47e35 0%, #c2a25b 50%, #a47e35 100%)",
        "gold-gradient-dark": "linear-gradient(135deg, #a47e35 0%, #c2a25b 50%, #73541e 100%)",
        "gold-gradient-btn": "linear-gradient(135deg, #a47e35 0%, #c2a25b 50%, #a47e35 100%)",
        "obsidian-radial": "radial-gradient(circle at 50% 0%, rgba(164, 126, 53, 0.15) 0%, rgba(9, 10, 15, 0.95) 70%)",
        "glass-radial": "radial-gradient(ellipse at top, rgba(194, 162, 91, 0.12), transparent 60%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(164, 126, 53, 0.3)",
        "gold-glow-lg": "0 0 50px -10px rgba(164, 126, 53, 0.4)",
        "gold-glow-sm": "0 0 12px 0 rgba(164, 126, 53, 0.25)",
        "obsidian-card": "0 20px 40px -15px rgba(0, 0, 0, 0.8)",
        "lift": "0 10px 30px -12px rgba(255, 255, 255, 0.18)",
        "lift-lg": "0 20px 40px -20px rgba(255, 255, 255, 0.14)",
        "winner-glow": "0 0 0 1px rgba(255, 255, 255, 0.4), 0 20px 45px -15px rgba(255, 255, 255, 0.25)",
        "winner-glow-gold": "0 0 0 1px rgba(164, 126, 53, 0.5), 0 20px 45px -15px rgba(164, 126, 53, 0.35)",
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
