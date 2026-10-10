/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
        },
        'accent-warm': 'rgb(var(--color-accent-warm) / <alpha-value>)',
        'accent-sun': 'rgb(var(--color-accent-sun) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Geist Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
  plugins: [],
}
