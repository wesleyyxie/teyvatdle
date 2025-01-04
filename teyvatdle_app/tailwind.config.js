/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./templates/*.html",
    "./static/scripts/*.js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'background': "url('/static/images/background.jpg')",
      },
    },
    screens: {
      'container': '510px',
    }
  },
  plugins: [],
}