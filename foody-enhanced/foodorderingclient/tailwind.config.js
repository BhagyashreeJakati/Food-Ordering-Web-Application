/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
      colors: {
        foody: {
          orange: '#ff5722',
          red: '#E23744',
          green: '#2e7d32',
        },
      },
      lineClamp: { 2: '2', 3: '3' },
    },
  },
  plugins: [],
};
