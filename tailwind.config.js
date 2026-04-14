/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,html}'],
  theme: {
    extend: {
      colors: {
        bg:           '#080808',
        surface:      '#0f0f0f',
        border:       '#1e1e1e',
        'border-hi':  '#2e2e2e',
        muted:        '#555555',
        dim:          '#333333',
        accent:       '#c8ff00',
        'accent-dim': '#8ab300',
        text:         '#e8e8e8',
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Syne', 'sans-serif'],
      },
      animation: {
        'grid-drift':       'grid-drift 30s linear infinite',
        'spin-slow':        'spin-slow 20s linear infinite',
        'neon-flicker':     'neon-flicker 2.5s ease-in-out infinite',
        'neon-flicker-alt': 'neon-flicker 2.5s ease-in-out infinite alternate',
        'fade-up-1':        'fade-up 0.6s 0.2s forwards',
        'fade-up-2':        'fade-up 0.7s 0.35s forwards',
        'fade-up-3':        'fade-up 0.7s 0.5s forwards',
        'fade-up-4':        'fade-up 0.7s 0.65s forwards',
        'fade-in':          'fade-in 0.8s 0.5s forwards',
        'vignette-flicker': 'vignette-flicker 7s ease-in-out infinite alternate',
        'crt-curve':        'crt-curve 8s ease-in-out infinite alternate',
        'glitch-top':       'glitch-top 0.4s linear infinite alternate-reverse',
        'glitch-bottom':    'glitch-bottom 0.35s linear infinite alternate-reverse',
        'scanline':         'scanline 12s linear infinite',
        'splash-bar':       'splash-bar 0.9s cubic-bezier(0.4,0,0.2,1) forwards',
        'skeleton-pulse':   'skeleton-pulse 1.2s ease-in-out infinite',
      },
      keyframes: {
        'grid-drift': {
          from: { backgroundPosition: '0 0' },
          to:   { backgroundPosition: '60px 60px' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'neon-flicker': {
          '0%':   { opacity: '0.22' },
          '100%': { opacity: '0.55' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'vignette-flicker': {
          '0%':   { opacity: '0.82' },
          '100%': { opacity: '0.95' },
        },
        'crt-curve': {
          '0%':   { transform: 'perspective(800px) rotateX(1deg)' },
          '100%': { transform: 'perspective(800px) rotateX(-1deg)' },
        },
        'glitch-top': {
          '0%':   { clip: 'rect(10px,9999px,50px,0)', transform: 'skew(1deg)' },
          '20%':  { clip: 'rect(25px,9999px,70px,0)', transform: 'skew(3deg)' },
          '40%':  { clip: 'rect(15px,9999px,55px,0)', transform: 'skew(2deg)' },
          '100%': { clip: 'rect(35px,9999px,80px,0)', transform: 'skew(0deg)' },
        },
        'glitch-bottom': {
          '0%':   { clip: 'rect(40px,9999px,85px,0)', transform: 'skew(-2deg)' },
          '25%':  { clip: 'rect(55px,9999px,90px,0)', transform: 'skew(-1deg)' },
          '100%': { clip: 'rect(50px,9999px,75px,0)', transform: 'skew(0deg)' },
        },
        'scanline': {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        'splash-bar': {
          from: { width: '0%' },
          to:   { width: '100%' },
        },
        'skeleton-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}