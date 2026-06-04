import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:             '#F5F0E8',
        bg2:            '#EDE8DF',
        surface:        '#FFFFFF',
        ink:            '#1A1A1A',
        stone:          '#999999',
        accent:         '#C4724A',
        'accent-dark':  '#A85A35',
        amber:          '#C9913F',
        'rx-yellow':    '#F4E84B',
      },
      fontFamily: {
        heebo: ['var(--font-heebo)', 'system-ui', 'sans-serif'],
        mono:  ['"Courier New"', 'Courier', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(2.5rem, 7vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h1:   ['clamp(2rem, 5vw, 3rem)',   { lineHeight: '1.2' }],
        h2:   ['1.5rem',                   { lineHeight: '1.3' }],
        body: ['1rem',                     { lineHeight: '1.7' }],
        sm:   ['0.875rem',                 { lineHeight: '1.7' }],
        xs:   ['0.75rem',                  { lineHeight: '1.5' }],
      },
      boxShadow: {
        sm:  '0 1px 2px rgba(26,26,26,0.04)',
        md:  '0 4px 16px rgba(26,26,26,0.06)',
        lg:  '0 12px 40px rgba(26,26,26,0.10)',
        nav: '0 1px 0 rgba(0,0,0,0.06)',
      },
      borderRadius: {
        sm:   '6px',
        md:   '12px',
        lg:   '16px',
        xl:   '24px',
        pill: '999px',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
