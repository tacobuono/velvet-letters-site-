export type RouteDef = { to: string; label: string };

export const ROUTES: RouteDef[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/process', label: 'Process' },
  { to: '/styles', label: 'Styles' },
  { to: '/contact', label: 'Contact' },
  { to: '/post-office', label: 'Post Office' },
];

// Bright/paper routes need dark ink chrome; the cinematic routes use cream.
export const LIGHT_ROUTES = new Set(['/about', '/contact']);
