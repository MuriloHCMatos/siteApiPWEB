/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { display: ['"Plus Jakarta Sans"', 'sans-serif'], numbers: ['"Space Grotesk"', 'monospace'] },
      keyframes: { 'soft-pulse': { '0%, 100%': { opacity: '.55' }, '50%': { opacity: '1' } } },
      animation: { 'soft-pulse': 'soft-pulse 1.7s ease-in-out infinite' }
    }
  },
  plugins: []
}
