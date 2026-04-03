/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: '#0F172A', // slate-900
          card: '#1E293B', // slate-800
          accent: '#0EA5E9', // sky-500
          yellow: '#FDE047', // yellow-300
          green: '#22C55E', // green-500
          red: '#EF4444', // red-500
        }
      }
    },
  },
  plugins: [],
}
