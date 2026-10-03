/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          burgundy: "#b16964",
          darkred: "#8b2f30",
          crimson: "#a33f3d",
          rose: "#e49696",
          softpink: "#dfbaba",
          bg: "#f9f1ef",
          cardbg: "#ffffff",
          text: "#3b3232",
          subtext: "#666666",
        }
      },
      fontFamily: {
        sans: ["var(--font-quicksand)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        cormorant: ["var(--font-cormorant)", "serif"],
      },
    },
  },
  plugins: [],
};
