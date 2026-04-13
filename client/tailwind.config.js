/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vip: {
          light: '#fde68a', // Amber 200
          DEFAULT: '#fbbf24', // Amber 400
          dark: '#b45309', // Amber 700
        }
      }
    },
  },
  plugins: [],
}
