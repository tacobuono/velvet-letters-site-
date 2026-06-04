import { useEffect } from 'react';

// Canonical base. Brand domain is the plural velvetletters.com — confirm DNS/host
// is configured for this exact host (and www vs apex) before launch.
export const SITE_URL = 'https://velvetletters.com';
export const SITE_NAME = 'Velvet Letters';
// Branded 1200x630 OG card. Currently an SVG (generated in-repo, no design tool was
// available); convert to og-image.jpg/png before launch for Facebook/X scrapers,
// which don't reliably render SVG. See HIGGSFIELD_ASSETS.md.
export const OG_IMAGE = `${SITE_URL}/og-image.svg`;

type JsonLd = Record<string, unknown>;

export type SeoInput = {
  title: string;
  description: string;
  /** Route path beginning with "/", e.g. "/about". */
  path: string;
  jsonLd?: JsonLd | JsonLd[];
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSONLD_ID = 'route-jsonld';

/**
 * Per-route SEO: unique title, description, canonical, Open Graph / Twitter cards,
 * and route-scoped JSON-LD. Manual head management keeps the bundle lean (no
 * react-helmet) and works fine for a client-routed SPA.
 */
export function useSeo({ title, description, path, jsonLd }: SeoInput) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertCanonical(url);

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:image', OG_IMAGE);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', OG_IMAGE);

    let script = document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = JSONLD_ID;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, jsonLd]);
}

// Shared structured-data builders ------------------------------------------------

export const organizationLd: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  description:
    'Velvet Letters designs and builds cinematic, immersive, custom websites — 3D, storytelling, SEO/GEO and conversion strategy for premium brands.',
  url: SITE_URL,
  email: 'hello@velvetletters.com',
  areaServed: 'Worldwide',
  serviceType: [
    'Cinematic website design',
    '3D website development',
    'Immersive web experiences',
    'Custom brand websites',
    'SEO and GEO strategy',
    'Conversion-focused web design',
  ],
};

export function webPageLd(name: string, path: string, description: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
