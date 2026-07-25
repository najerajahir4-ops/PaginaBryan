/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: "var(--carbon)",
        'rojo-impacto': "var(--rojo-impacto)",
        'dorado-campeon': "var(--dorado-campeon)",
        'azul-cinturon': "var(--azul-cinturon)",
        'tatami-blanco': "var(--tatami-blanco)",
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      keyframes: {
        hit: {
          '0%': { transform: 'translateX(-40px)', opacity: '0' },
          '70%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'hit': 'hit 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'hit-delay': 'hit 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.15s forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}
