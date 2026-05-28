/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        bebas:   ['"Bebas Neue"', 'Impact', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        'brand-green': '#0d311b',
        'brand-dark':  '#0f1f0f',
        'gold':        '#C9A447',
      },
      letterSpacing: {
        'widest2': '0.25em',
      },
    },
  },
  plugins: [],
}
