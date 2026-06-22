/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F5F2",
        ink: "#14171F",
        indigo: {
          DEFAULT: "#4338CA",
          dark: "#352DA0",
        },
        sand: "#E8E2D6",
        coral: "#E8603C",
        slate: {
          DEFAULT: "#6B7280",
        },
        soc: {
          bg: "#0B0E14",
          panel: "#131722",
          panel2: "#1A1F2C",
          border: "#232938",
          text: "#D7DCE5",
          muted: "#7C8699",
          green: "#3DDC84",
          amber: "#F5A623",
          red: "#FF5C5C",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
