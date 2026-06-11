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
  // NOTE: "sage" names are historical — the hero world was warmed from teal/sage
  // into the plum family so the whole site shares one palette (gold/plum/cream).
  // Still lighter than velvetDeep, preserving the bright-open → dark-dive arc.
  sageBg: '#31182a',
  sageFloor: '#241019',
  letterBase: '#3a1818',
  furMauve: '#7a4a55',
  furPink: '#c4858a',
  furDeep: '#8a4550',
  rose: '#a55c5c',
  roseLight: '#c88a8a',
  roseDeep: '#6a2828',
  panelBg: '#d4c5a8',
  panelInk: '#9c3322',
  heroKey: '#fff5dc',
  heroFill: '#9a6a7e', // dusty mauve fill (was teal #5a8a99) — cool-vs-warm split stays inside the warm family
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
