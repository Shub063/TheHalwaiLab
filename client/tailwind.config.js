/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF9F43',
          DEFAULT: '#FF7F00',
          dark: '#E67300',
        },
      },
    },
  },
  plugins: [],
}

