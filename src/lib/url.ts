/** Base-path aware URL helpers. The site deploys under /HandiWorks-Co.-Website/ on GitHub Pages. */
import { CONTACT_EMAILS } from './team';

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

/** A link that starts an email with its subject filled in. With no address it goes to all four people. */
export const mailto = (subject: string, to: string = CONTACT_EMAILS, body?: string) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

/** "Request a kit": to all four, with the three things the team needs to know already asked.
    The homepage (index.html) carries the same link written out by hand: change both together. */
export const KIT_REQUEST = mailto('HelpingHand kit request', CONTACT_EMAILS, 'School or group:\nGrade or ages:\nNumber of students:\n\nWhat we would like to do with HelpingHand:\n');

/** Into the classroom demo in one click: /signin/ sets the role and goes straight on.
    `to` is a page inside the site, for example '/dashboard/student/simulator/'. */
export const demo = (role: 'teacher' | 'student', to?: string) =>
  p('/signin/') + `?as=${role}` + (to ? `&to=${encodeURIComponent(to)}` : '');
