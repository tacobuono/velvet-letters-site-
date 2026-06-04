// All copy lifted verbatim from the existing Velvet Letters static site (VL Website 2/index.html).
// Keep this as the single source of truth for DOM overlay + 3D labels.

export const HERO = {
  eyebrow: 'Velvet Letters — Cinematic Web Design',
  h1Lead: 'Cinematic websites people',
  h1Em: 'feel, remember, and act on.',
  sub: 'Velvet Letters designs immersive, story-driven websites for brands that want to leave an impression.',
};

export const PHILOSOPHY = {
  label: 'Our Philosophy',
  headingLead: 'Every brand has',
  headingEm: 'an unwritten story',
  body: "Most websites shout. We compose. We believe the most powerful brand experiences are the ones that pull people in, not push messages out. Velvet Letters builds websites at the intersection of cinematic craft and conversion strategy — sites that feel inevitable rather than intrusive.",
};

export type Service = { number: string; title: string; body: string };

// What Velvet Letters actually makes — website design, not generic agency marketing.
export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Cinematic Websites',
    body: 'Art-directed lighting, motion, and pacing — sites composed like film, built to be felt and remembered.',
  },
  {
    number: '02',
    title: 'Immersive & 3D',
    body: 'Real-time WebGL worlds visitors move through, not just read. Depth, weight, and light that flat sites cannot fake.',
  },
  {
    number: '03',
    title: 'Storytelling Sites',
    body: 'Scroll-driven narratives that unfold like a letter — earning attention and paying it back.',
  },
  {
    number: '04',
    title: 'SEO / GEO',
    body: 'Built to be found — by search engines and answer engines. Entities, structure, and signals designed in.',
  },
  {
    number: '05',
    title: 'Conversion Systems',
    body: 'Beautiful paths engineered to turn attention into action, without ever feeling like a funnel.',
  },
  {
    number: '06',
    title: 'Custom Brand Worlds',
    body: 'Bespoke design languages that exist nowhere else — the opposite of a template.',
  },
];

export type ProcessStep = { numeral: string; title: string; body: string };

export const PROCESS: ProcessStep[] = [
  {
    numeral: 'I',
    title: 'Immersion',
    body: "We disappear into your world. Your customers, your competitors, your culture. We don't start creating until we understand the terrain completely.",
  },
  {
    numeral: 'II',
    title: 'Architecture',
    body: 'Strategy before aesthetics. We map the narrative structure, identify the pressure points, and engineer the emotional journey before a single pixel moves.',
  },
  {
    numeral: 'III',
    title: 'Creation',
    body: 'Now we build. Every asset, every touchpoint, every word crafted to serve the strategic framework. Beauty with purpose, never decoration for its own sake.',
  },
  {
    numeral: 'IV',
    title: 'Amplification',
    body: 'Launch, measure, refine, scale. We treat campaigns as living systems, continuously optimizing toward the metrics that actually move your business forward.',
  },
];

// Studio manifesto — our own words, NOT a client testimonial. (Fake testimonial
// and named client removed per the QA pass; we do not invent clients or quotes.)
export const MANIFESTO = {
  quote:
    "We don't build ordinary websites. We design digital impressions — felt, remembered, and built to act.",
  attribution: 'The Velvet Letters studio promise',
};

export const CTA = {
  headingLead: 'Ready to write',
  headingEm: 'your next chapter?',
  sub: "Let's craft something that lasts.",
  button: 'Get in Touch',
};

export const NAV_LINKS = [
  { label: 'About', href: 'about.html' },
  { label: 'Contact', href: 'contact.html' },
  { label: 'Process', href: 'process.html' },
  { label: 'All Styles', href: 'all-styles.html' },
  { label: 'Post Office', href: 'post-office.html' },
];

// Section identifiers, in scroll order. Each maps to one camera waypoint.
export const SECTIONS = [
  'hero',
  'philosophy',
  'services',
  'process',
  'testimonial',
  'cta',
] as const;

export type SectionId = (typeof SECTIONS)[number];
