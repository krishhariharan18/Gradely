/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cyanAccent: "#00e5ff",
        pinkAccent: "#c724b1",
        purpleAccent: "#7c3aed",
        panel: "rgba(255, 255, 255, 0.05)",
        panelBorder: "rgba(255, 255, 255, 0.1)",
        inputBg: "#1e1040",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glowCyan: "0 10px 30px rgba(0, 229, 255, 0.22)",
      },
      keyframes: {
        pageIn: {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.99)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        pageIn: "pageIn 420ms ease-out",
      },
    },
  },
  plugins: [],
};
