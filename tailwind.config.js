/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 'media' 대신 'class'로 설정
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};