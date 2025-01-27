/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}","./public.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        mulish: ['Mulish', 'sans-serif'], // Adding Mulish font to Tailwind theme
        Inter:['Inter', 'sans-serif']
      },
      screens: {
        xs: '425px',
        xxs: '375px',
        xxxs: '320px',
      },
      boxShadow: {
        "specific-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -14px rgb(0 0 0 / 0.1)", // Custom shadow
      },
    },
  },
  plugins: [],
}

