/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{ejs,html,css}",
    "./public/**/*.{js,css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: ['hidden', 'block', 'sm:block', 'sm:hidden']
}

