// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-yellow-400",
    "bg-red-600",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
