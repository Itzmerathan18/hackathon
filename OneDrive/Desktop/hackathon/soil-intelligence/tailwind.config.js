/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1f9f4",
          100: "#dcefe3",
          200: "#c4e4d0",
          300: "#98cfac",
          400: "#61b27f",
          500: "#3a915e",
          600: "#287047",
          700: "#215a39",
          800: "#1c4630",
          900: "#173928",
        },
        amberfield: "#fef3c7",
        earth: "#f5efe6",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

