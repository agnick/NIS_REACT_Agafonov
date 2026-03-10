import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: "#ff2d75",
          blue: "#00f0ff",
          purple: "#b026ff",
          green: "#39ff14",
          yellow: "#fff01f",
        },
        cyber: {
          dark: "#0a0a0f",
          darker: "#050508",
          card: "#12121a",
          border: "#1e1e2e",
          surface: "#16161f",
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', "monospace"],
        display: ['"Orbitron"', "sans-serif"],
      },
      boxShadow: {
        "neon-pink": "0 0 5px #ff2d75, 0 0 20px rgba(255, 45, 117, 0.3)",
        "neon-blue": "0 0 5px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3)",
        "neon-purple": "0 0 5px #b026ff, 0 0 20px rgba(176, 38, 255, 0.3)",
        "neon-green": "0 0 5px #39ff14, 0 0 20px rgba(57, 255, 20, 0.3)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "scanline": "scanline 8s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #00f0ff, 0 0 10px rgba(0, 240, 255, 0.2)" },
          "100%": { boxShadow: "0 0 10px #00f0ff, 0 0 30px rgba(0, 240, 255, 0.4)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%": { opacity: "0.97" },
          "5%": { opacity: "0.95" },
          "10%": { opacity: "0.97" },
          "15%": { opacity: "0.94" },
          "20%": { opacity: "0.98" },
          "100%": { opacity: "0.98" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "50px 50px",
      },
    },
  },
  plugins: [],
};

export default config;
