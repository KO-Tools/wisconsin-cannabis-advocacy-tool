/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'ko-primary': '#155756',
        'ko-secondary': '#88AEAD',
        'ko-accent': '#ADEEEE',
        'ko-background': '#F1F2F3'
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
}