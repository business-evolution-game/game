/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/front/index.html",
    './src/front/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e3e3e3',
          DEFAULT: '#343434',
          dark: '#343434',
        },
        secondary: '#9333EA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Custom fonts
      },
      spacing: {
        '128': '32rem', // Custom spacing
      },
    },
  },
  plugins: [],
}

