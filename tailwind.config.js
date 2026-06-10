/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
      colors: {
        brandDark: '#050814',      // Very Deep Navy-Black (Dark Blue Base)
        brandGray: '#0b1220',      // Deep Blue-Grey Card Base (Dark Blue)
        brandAccent: '#38bdf8',    // Bright Sky Blue (Light Blue Accent)
        brandCreative: '#2563eb',  // Vibrant Royal Blue (Dark Blue Accent)
      }
    },
  },
  plugins: [],
}
