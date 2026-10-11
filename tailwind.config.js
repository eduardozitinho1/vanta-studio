/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:   { DEFAULT: '#0A0A0A', 900: '#0A0A0A', 800: '#141414', 700: '#1C1C1C', 600: '#262626' },
        paper: '#FAF9F6',
        bone:  '#F1EEE8',
        line:  '#E4E0D8',
        ash:   '#6E6E6E',
        smoke: '#9A9A9A',
        accent:'#B8935A',
      },
      fontFamily: {
        sans: ['Inter','system-ui','-apple-system','sans-serif'],
        display: ['"Instrument Serif"','Georgia','serif'],
      },
      letterSpacing: { ultra: '0.32em', wide2: '0.18em' },
      fontSize: {
        '7.5xl': ['5.75rem',{lineHeight:'0.95'}],
        '8xl':   ['7rem',{lineHeight:'0.92'}],
        '9xl':   ['9rem',{lineHeight:'0.88'}],
      },
      maxWidth: { screen2xl: '1600px' },
      keyframes: {
        marquee:   { '0%':{transform:'translateX(0)'}, '100%':{transform:'translateX(-50%)'} },
        fadeUp:    { from:{opacity:'0',transform:'translateY(28px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        fadeIn:    { from:{opacity:'0'}, to:{opacity:'1'} },
        slideDown: { from:{opacity:'0',transform:'translateY(-8px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        shimmer:   { '100%':{transform:'translateX(100%)'} },
      },
      animation: {
        marquee:   'marquee 45s linear infinite',
        fadeUp:    'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both',
        fadeIn:    'fadeIn 0.6s ease both',
        slideDown: 'slideDown 0.25s ease both',
        shimmer:   'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
