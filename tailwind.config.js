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
        // Paper worlds (About, Contact). Accent tokens kept for markup stability but
        // folded into the brand family — gold/ochre + plum — so no orphan lime,
        // yellow, or green survives. One accent family across dark and paper pages.
        paper: '#f1e9da',
        'paper-deep': '#e4d8c2',
        ink: '#1b1714',
        acid: '#b8923f', // ochre (was lime #b9c44b)
        'acid-deep': '#876626', // deep ochre, reads on paper (was #8c9a2e)
        sun: '#d8b24a', // warm gold card (was yellow #f4d23c)
        'sun-deep': '#9c7a2e', // deep ochre letterpress shadow (was #e7b400)
        meadow: '#5c1a4a', // plum link / active-nav on paper (was green #3f7d4e)
        'meadow-light': '#7a3a63', // lighter plum hover (was #7fb069)
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
