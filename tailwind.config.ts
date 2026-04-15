import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#4B8E82',
        'forest-dark': '#31695F',
        black: '#121213',
        'grey-light': '#FAFAFA',
        'grey-mid': '#F5F5F5',
        'pastel-red': '#FFA287',
        'pastel-purple': '#A887FF',
        'teamed-red': '#F43855',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      borderRadius: {
        btn: '9999px',
        card: '1rem',
        input: '0.75rem',
      },
    },
  },
  plugins: [],
}
export default config
