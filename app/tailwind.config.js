/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f12', card: '#17181d', ink: '#e8e8ef', muted: '#a0a3ad',
        accent: '#4ee071', danger: '#ff5470'
      }
    }
  },
  plugins: []
}
