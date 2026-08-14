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
        display: ['Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        heading: ['Anton', 'sans-serif'],
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
      },
      typography: ({ theme }) => ({
        dorado: {
          css: {
            '--tw-prose-body': theme('colors.tatami-blanco / 0.8'),
            '--tw-prose-headings': theme('colors.tatami-blanco'),
            '--tw-prose-lead': theme('colors.tatami-blanco / 0.9'),
            '--tw-prose-links': theme('colors.dorado-campeon'),
            '--tw-prose-bold': theme('colors.tatami-blanco'),
            '--tw-prose-counters': theme('colors.dorado-campeon'),
            '--tw-prose-bullets': theme('colors.dorado-campeon'),
            '--tw-prose-hr': theme('colors.white / 0.1'),
            '--tw-prose-quotes': theme('colors.dorado-campeon'),
            '--tw-prose-quote-borders': theme('colors.dorado-campeon'),
            '--tw-prose-captions': theme('colors.tatami-blanco / 0.5'),
            '--tw-prose-code': theme('colors.rojo-impacto'),
            '--tw-prose-pre-code': theme('colors.tatami-blanco'),
            '--tw-prose-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-th-borders': theme('colors.white / 0.2'),
            '--tw-prose-td-borders': theme('colors.white / 0.1'),
            
            // Custom sizing and spacing for editorial feel
            'h1, h2': {
              fontFamily: theme('fontFamily.heading').join(', '),
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '2.5rem',
              lineHeight: '1.2',
              marginTop: '2.5em',
              marginBottom: '1em',
            },
            'h3, h4': {
              fontFamily: theme('fontFamily.display').join(', '),
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: theme('colors.dorado-campeon'),
              fontSize: '1.25rem',
              fontWeight: '800',
              marginTop: '2em',
              marginBottom: '0.5em',
            },
            'a': {
              textDecoration: 'none',
              borderBottom: `1px solid ${theme('colors.dorado-campeon / 0.3')}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderBottomColor: theme('colors.dorado-campeon'),
                backgroundColor: theme('colors.dorado-campeon / 0.1'),
              }
            },
            'blockquote': {
              backgroundColor: theme('colors.dorado-campeon / 0.05'),
              padding: '1rem 1.5rem',
              borderRadius: '0 0.5rem 0.5rem 0',
              fontStyle: 'italic',
            },
            'strong': {
              color: theme('colors.dorado-campeon'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
