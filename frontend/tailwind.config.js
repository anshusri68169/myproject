/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
        success: '#06D6A0',
        warning: '#FFD60A',
        danger: '#EF476F',
        dark: '#1A1A1A',
        light: '#F5F5F5',
      },
    },
  },
  plugins: [],
}
