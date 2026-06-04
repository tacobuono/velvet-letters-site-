// Brand tokens — pulled directly from the existing Velvet Letters site. Do not improvise.

export const COLORS = {
  // existing brand
  velvet: '#3a0a2e',
  velvetDeep: '#1a0515',
  velvetMid: '#5c1a4a',
  gold: '#c9a84c',
  goldLight: '#e8d5a3',
  goldBright: '#f0c755',
  cream: '#f5efe6',
  creamWarm: '#faf3e8',
  blush: '#d4a5a5',
  charcoal: '#1a1a1a',

  // hero scene — romantic decay (VL-monogram-study reference)
  sageBg: '#2c4541',
  sageFloor: '#1a2725',
  letterBase: '#3a1818',
  furSage: '#546f63',
  furPink: '#c4858a',
  furDeep: '#8a4550',
  rose: '#a55c5c',
  roseLight: '#c88a8a',
  roseDeep: '#6a2828',
  panelBg: '#d4c5a8',
  panelInk: '#9c3322',
  heroKey: '#fff5dc',
  heroFill: '#5a8a99',
  heroRim: '#c4858a',
} as const;

export const FONTS = {
  display: "'Playfair Display', serif", // h1, h2, monograms
  editorial: "'Cormorant Garamond', serif", // body italics, quotes
  ui: "'Outfit', sans-serif", // labels, nav, buttons
} as const;

// Self-hosted font files for 3D <Text> (troika cannot parse woff2 — plain .woff only)
export const FONT_FILES = {
  displayBlack: '/fonts/PlayfairDisplay-900.woff',
  displayBold: '/fonts/PlayfairDisplay-700.woff',
  ui: '/fonts/Outfit-400.woff',
  uiMedium: '/fonts/Outfit-500.woff',
  editorial: '/fonts/Cormorant-400.woff',
} as const;

export const CONTACT_EMAIL = 'hello@velvetletters.com';
