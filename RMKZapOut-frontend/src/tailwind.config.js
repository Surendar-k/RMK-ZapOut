/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          start: "#4f46e5", // indigo
          mid: "#6366f1",
          end: "#3b82f6", // blue
        },
        accent: "#22f3c7", // neon cyan / green
        glass: "rgba(255, 255, 255, 0.12)",
      },
      backgroundImage: {
        "app-gradient":
          "linear-gradient(135deg, #0b0f1a 0%, #111827 40%, #0b1224 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))",
      },
      backdropBlur: {
        glass: "16px",
      },
      boxShadow: {
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
};
