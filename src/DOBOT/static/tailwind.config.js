/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "../templates/**/*.{html,js}", "../templates/*.{html,js}", '../static/js/*.js', '../static/*.js',
      'node_modules/preline/dist/*.js',
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('preline/plugin'),
      require('@tailwindcss/forms'),
    ],
  }