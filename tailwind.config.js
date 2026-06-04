/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        velvet: '#3a0a2e',
        'velvet-deep': '#1a0515',
        'velvet-mid': '#5c1a4a',
        gold: '#c9a84c',
        'gold-light': '#e8d5a3',
        'gold-bright': '#f0c755',
        cream: '#f5efe6',
        'cream-warm': '#faf3e8',
        blush: '#d4a5a5',
        rose: '#a55c5c',
        // About — catalogue / atelier paper world
        paper: '#f1e9da',
        'paper-deep': '#e4d8c2',
        ink: '#1b1714',
        acid: '#b9c44b',
        'acid-deep': '#8c9a2e',
        // Contact — bright newspaper / classified world
        sun: '#f4d23c',
        'sun-deep': '#e7b400',
        meadow: '#3f7d4e',
        'meadow-light': '#7fb069',
        newsprint: '#fbf7ea',
      },
      fontFamily: {
        display: ["'Playfair Display'", 'serif'],
        editorial: ["'Cormorant Garamond'", 'serif'],
        ui: ["'Outfit'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
