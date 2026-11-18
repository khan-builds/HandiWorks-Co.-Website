import type { Status } from '../data/mock';

/** LED-style dot classes from global.css, shared by both dashboards. */
export const DOT_CLASS: Record<Status, string> = { done: 'dot-done', 'in-progress': 'dot-progress', 'not-started': 'dot-none' };
