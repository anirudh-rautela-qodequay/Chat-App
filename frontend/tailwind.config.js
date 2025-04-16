/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        my_bg: "rgba(var(--background))",
        my_text_color: "rgba(var(--color))",
      },
      screens: {
        xs: "450px", // 👈 Add your own breakpoint
      },
    },
  },
  plugins: [],
};
