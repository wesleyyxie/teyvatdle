/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./templates/*.html",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'background': "url('/static/images/background.jpg')",
      }
    },
  },
  plugins: [],
}