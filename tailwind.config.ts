import type { Config } from 'tailwindcss'

/**
 * Teamed brand palette — May 2026 rebuild.
 * Source of truth: https://teamed-website-platform.vercel.app/brand-kit
 *
 * The previous calculator ran on a cool teal palette (`forest #4B8E82`,
 * `pastel-red`, `pastel-purple`, `teamed-red`). That has been retired.
 * The new system is warm and editorial: parchment surfaces, burnt sienna
 * CTAs, amber accents, sage success, deep forest ink.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#121213',

        // Warm neutral surface ramp — every page background, card, hairline border
        parchment: {
          DEFAULT: '#F5F1EA',
          50: '#FAFAF7',
          100: '#F5F1EA',
          200: '#F0EBE3',
          300: '#E5DDD0',
          400: '#C9BEAD',
          500: '#9E9382',
          600: '#6B6155',
          700: '#4A4238',
          800: '#3A3632',
          900: '#24211E',
        },

        // Primary CTA + EOR-cost line on the chart
        sienna: {
          DEFAULT: '#C4654A',
          100: '#F2D9CE',
          300: '#D99682',
          500: '#C4654A',
          600: '#B44C2D',
          700: '#924530',
          900: '#5C2B1D',
        },

        // Accent colour (warm)
        amber: {
          DEFAULT: '#D4A574',
          100: '#F5E6CF',
          300: '#E4C399',
          500: '#D4A574',
          700: '#A37F52',
          900: '#6B5235',
        },

        // Success state + entity-cost line on the chart
        sage: {
          DEFAULT: '#8B9E7E',
          100: '#DFE6D8',
          300: '#B4C2A8',
          500: '#8B9E7E',
          700: '#5F6F52',
          900: '#384130',
        },

        // Deep ink for headlines on light, secondary text accents
        forest: {
          DEFAULT: '#2D3B2D',
          100: '#D6DCD3',
          300: '#8FA18B',
          500: '#5A6B56',
          700: '#2D3B2D',
          900: '#1A2419',
        },

        // Semantic status from the brand-kit page
        success: '#5F7F4B', // Postmark Green
        warning: '#C79140', // Kraft Yellow
        error: '#8E2E24', // Crimson Seal
        info: '#3E5670', // Ink Navy
      },

      fontFamily: {
        // Live-site role names (preferred for new code). All point at the
        // role aliases defined in globals.css :root, so swapping the underlying
        // typeface is a one-line change there.
        display: ['var(--font-family-display)', 'sans-serif'],
        body: ['var(--font-family-body)', 'sans-serif'],
        handwritten: ['var(--font-family-handwritten)', 'cursive'],
        script: ['var(--font-family-script)', 'cursive'],
        // Legacy aliases — existing components use `font-heading`, `font-sans`,
        // `font-marker`. Aliased to the role names above so they continue to
        // work unchanged. Migrate to the role names when touching a file.
        heading: ['var(--font-family-display)', 'sans-serif'],
        sans: ['var(--font-family-body)', 'sans-serif'],
        marker: ['var(--font-family-handwritten)', 'cursive'],
      },

      borderRadius: {
        // Rounded-square CTAs to match the new site (legacy was pill).
        btn: '0.75rem',
        card: '1rem',
        input: '0.75rem',
      },

      boxShadow: {
        // Warm-toned shadows on parchment surfaces. Base on parchment-900.
        card: '0 1px 2px rgba(36,33,30,0.04), 0 8px 24px rgba(36,33,30,0.06)',
        'card-hover': '0 1px 2px rgba(36,33,30,0.06), 0 12px 32px rgba(36,33,30,0.10)',
        // Subtle glow on primary CTAs (sienna)
        cta: '0 6px 18px rgba(196,101,74,0.24)',
        'cta-hover': '0 8px 22px rgba(196,101,74,0.32)',
      },
    },
  },
  plugins: [],
}
export default config
