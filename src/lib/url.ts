/** Base-path aware URL helpers. The site deploys under /HandiWorks-Co.-Website/ on GitHub Pages. */
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Link to a page. Ensures a trailing slash so static hosting resolves index.html. */
export function p(path: string): string {
  const [pathPart, suffix = ''] = splitSuffix(path);
  let clean = pathPart.startsWith('/') ? pathPart : '/' + pathPart;
  if (!clean.endsWith('/') && !/\.[a-z0-9]+$/i.test(clean)) clean += '/';
  return base + clean + suffix;
}

/** Link to a static asset in /public (no trailing slash). */
export function asset(path: string): string {
  return base + (path.startsWith('/') ? path : '/' + path);
}

function splitSuffix(path: string): [string, string] {
  const i = path.search(/[?#]/);
  return i === -1 ? [path, ''] : [path.slice(0, i), path.slice(i)];
}

export const CONTACT_EMAIL = 'lingbo.zhang@nyu.edu';
export const mailto = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
