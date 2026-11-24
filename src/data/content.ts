// Shared site constants. (The old home's copy lived here; the redesigned home
// keeps its copy beside its markup in src/components/BoxedOverlay.tsx.)

export const NAV_LINKS = [
  { label: 'About', href: 'about.html' },
  { label: 'Contact', href: 'contact.html' },
  { label: 'Process', href: 'process.html' },
  { label: 'All Styles', href: 'all-styles.html' },
  { label: 'Post Office', href: 'post-office.html' },
];

// Section identifiers, in scroll order (useScrollProgress derives scroll.section from these).
export const SECTIONS = [
  'hero',
  'philosophy',
  'services',
  'process',
  'testimonial',
  'cta',
] as const;

export type SectionId = (typeof SECTIONS)[number];
