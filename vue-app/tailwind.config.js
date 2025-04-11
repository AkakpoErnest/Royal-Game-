/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // indigo-500
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  }
}