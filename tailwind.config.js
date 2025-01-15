/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}","./public.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        mulish: ['Mulish', 'sans-serif'], // Adding Mulish font to Tailwind theme
        Inter:['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
}

