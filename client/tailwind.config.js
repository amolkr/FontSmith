/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#101418",
        paper: "#f7f3ea",
        brass: "#d6a84f",
        sea: "#31c7b7",
        coral: "#ee6f5b"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(49, 199, 183, 0.18)",
        card: "0 18px 60px rgba(16, 20, 24, 0.16)"
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(circle at 12% 20%, rgba(49,199,183,0.2), transparent 32%), radial-gradient(circle at 86% 12%, rgba(238,111,91,0.18), transparent 30%), linear-gradient(135deg, #101418 0%, #1b1f1d 52%, #141312 100%)",
        "mesh-light":
          "radial-gradient(circle at 12% 20%, rgba(49,199,183,0.22), transparent 32%), radial-gradient(circle at 86% 12%, rgba(214,168,79,0.2), transparent 30%), linear-gradient(135deg, #f7f3ea 0%, #edf7f4 52%, #fff8ee 100%)"
      }
    }
  },
  plugins: []
};

