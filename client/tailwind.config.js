/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dojang: {
          navy: "#0B1550",
          navyDark: "#060D33",
          gold: "#C9A227",
          goldMuted: "#96771A",
          offwhite: "#F5F2E9",
          red: "#8C1D1D",
          redHover: "#6B1414",
          carbon: "#111114",
          carbonLight: "#1C1C21",
        }
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'tatami': '4px',
        'chamfer': '8px',
        'card': '6px',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up-delay': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      }
    },
  },
  plugins: [],
}
